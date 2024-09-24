import Event from "../models/event.js";
import cloudinary from "cloudinary";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import { v4 as uuidv4 } from "uuid";
import cron from "node-cron";
import moment from "moment";

// Function to calculate and update event status
async function updateEventStatus(event) {
  const now = moment(); // Current time
  const eventStart = moment(event.eventDate)
    .set("hour", event.eventTimeFrom.split(":")[0])
    .set("minute", event.eventTimeFrom.split(":")[1]);
  const eventEnd = moment(event.eventDate)
    .set("hour", event.eventTimeTo.split(":")[0])
    .set("minute", event.eventTimeTo.split(":")[1]);

  let status = "Upcoming"; // Default status

  if (now.isAfter(eventEnd)) {
    status = "Ended";
  } else if (now.isBetween(eventStart, eventEnd)) {
    status = "Ongoing";
  }

  // Update the event status only if it has changed
  if (event.status !== status) {
    event.status = status;
    await event.save();
  }
}

// Cron job to update event statuses every minute (adjust as needed)
cron.schedule("*/1 * * * *", async () => {
  try {
    // Fetch all events
    const events = await Event.find({});

    // Loop through each event and update its status
    for (const event of events) {
      await updateEventStatus(event);
    }
  } catch (error) {
    console.error("Error updating event statuses:", error.message);
  }
});

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

    const emails = Array.isArray(coorganizerEmail)
      ? coorganizerEmail
      : [coorganizerEmail];
    for (const email of emails) {
      const trimmedEmail = email.trim().toLowerCase();
      const coorganizer = await User.findOne({ email: trimmedEmail });

      if (coorganizer) {

        const newNotification = new Notification({
          to: coorganizer._id,
          event: savedEvent._id,
          type: "co-organizer added",
        });
        await newNotification.save();
      } else {
        console.log(`Co-organizer with email ${trimmedEmail} not found.`);
      }
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
    const createdEvents = await Event.find({ organizer: userId }).populate(
      "organizer"
    );
    const coOrganizedEvents = await Event.find({
      coorganizerEmail: { $in: [userEmail] },
    }).populate("organizer");
    const allEvents = [
      ...createdEvents.map((event) => ({
        ...event.toObject(),
        role: "Organizer",
      })),
      ...coOrganizedEvents.map((event) => ({
        ...event.toObject(),
        role: "Co-Organizer",
      })),
    ];
    res.status(200).json(allEvents);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function handleGetEvents(req, res) {
  try {
    const { date, location, price } = req.body;

    const events = await Event.find({
      eventDate: date,
      eventLocation: location,
      eventType: "public",
      eventPrice: price, // Ensure this matches your database field for visibility
    })
      .populate("attendees")
      .populate("organizer")
      .populate("coorganizerEmail");

    // Send the filtered events as a JSON response
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function handleGetEventById(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json({ msg: "No id to find event" });

    const event = await Event.findById(id)
      .populate({
        path: "organizer",
        select: "profilePicUrl email fullname _id",
      })
      .populate({
        path: "attendees.userId", // Populate userId field within attendees
        select: "profilePicUrl email fullname _id", // Select fields from the user model
      });
    if (!event) return res.status(404).json({ msg: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function handleAttendEvent(req, res) {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;
    if (!eventId) return res.status(404).json({ msg: "No event found" });
    const code = uuidv4().slice(0, 4).toUpperCase();
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: "Event not found." });
    }
    const alreadyAttended = event.attendees.some((attendee) =>
      attendee.userId.equals(userId)
    );

    if (!alreadyAttended) {
      // Add the user and their QR code to the event's attendees list
      event.attendees.push({
        userId: userId,
        code: code,
      });
      const newNotification = new Notification({
        to: userId,
        event: eventId,
        type: "attended",
      });
      await newNotification.save();
      await event.save();

      const user = await User.findById(userId);
      if (user) {
        // Check if the event is already in the user's joinedEvents array
        if (!user.joinedEvents.includes(eventId)) {
          user.joinedEvents.push(eventId);
          await user.save();
        }
      }
    }

    res.status(200).json({
      msg: "Successfully joined the event.",
      attendeeCount: event.attendees.length,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function handleCheckIn(req, res) {
  try {
    const { userId, eventId } = req.body;
    const event = await Event.findById(eventId);
    const attendee = event.attendees.find(
      (att) => att.userId.toString() === userId
    );
    if (!attendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }
    attendee.checkedIn = true;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the event ID to the checkedInEvents array
    if (!user.checkedInEvents.includes(eventId)) {
      user.checkedInEvents.push(eventId);
      await user.save(); // Save the updated user document
    }

    await event.save();

    // Respond to the client
    res.status(200).json({ message: "Successfully checked in" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
}
