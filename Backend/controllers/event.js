import Event from "../models/event.js";
import cloudinary from "cloudinary";
import User from "../models/user.js";
import Notification from "../models/notification.js";
export async function handleCreateEvent(req, res) {
  try {
    const userId = req.user._id;
    const {
      eventName,
      eventDescription,
      eventType,
      eventDate,
      eventPrice,
      eventPriceValue,
      eventTimeFrom,
      eventTimeTo,
      eventLocation,
      eventLink,
      eventAddress,
      coorganizerEmail,
      organizer,
    } = req.body;
    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(fileBuffer);
      });
    };
    let eventThumbnailUrl = null;
    if (req.file) {
      // Upload to Cloudinary using the helper function
      const result = await uploadToCloudinary(req.file.buffer);
      eventThumbnailUrl = result.secure_url;
    }

    // a new event
    const newEvent = new Event({
      eventName,
      eventDescription,
      eventType,
      eventDate,
      eventPrice,
      eventPriceValue: eventPrice === "paid" ? eventPriceValue : null,
      eventTimeFrom,
      eventTimeTo,
      eventLocation,
      eventLink: eventLocation === "online" ? eventLink : null, // Only set if online
      eventAddress: eventLocation === "offline" ? eventAddress : null,
      eventThumbnail: eventThumbnailUrl,
      coorganizerEmail,
      organizer: userId,
    });

    const savedEvent = await newEvent.save();
    if (userId) {
      const user = await User.findById(userId);
      user.createdEvents.push(savedEvent._id);
      await user.save();
    }

    if (coorganizerEmail && Array.isArray(coorganizerEmail)) {
      for (const email of coorganizerEmail) {
        const coorganizer = await User.findOne({ email: email.trim() });
        if (coorganizer) {
          const newNotification = new Notification({
            to: coorganizer._id,
            event: savedEvent._id,
            type: "co-organizer added",
          });
          await newNotification.save();
        } else {
          console.log(`Co-organizer with email ${email.trim()} not found.`);
        }
      }
    } else {
      console.log(`Co-organizer with email ${email.trim()} not found.`);
    }
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
    console.log(error.message);
  }
}

export async function handleFindUser(req, res) {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email query parameter is required" });
    }
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
export async function handleUserEvents(req, res) {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;
    const createdEvents = await Event.find({ organizer: userId }).populate("organizer");
    const coOrganizedEvents = await Event.find({
      coorganizerEmail: { $in: [userEmail] },
    }).populate("organizer");
    const allEvents = [
      ...createdEvents.map(event => ({ ...event.toObject(), role: 'Organizer' })),
      ...coOrganizedEvents.map(event => ({ ...event.toObject(), role: 'Co-Organizer' })),
    ];
    res.status(200).json(allEvents);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
