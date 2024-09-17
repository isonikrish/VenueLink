import Event from "../models/event.js";
import cloudinary from "cloudinary";
import User from '../models/user.js'
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
      eventPriceValue: eventPrice === 'paid' ? eventPriceValue : null, 
      eventTimeFrom,
      eventTimeTo,
      eventLocation,
      eventLink: eventLocation === 'online' ? eventLink : null, // Only set if online
      eventAddress: eventLocation === 'offline' ? eventAddress : null,
      eventThumbnail: eventThumbnailUrl,
      coorganizerEmail,
      organizer: userId,
    })

    const savedEvent = await newEvent.save();
    if(userId){
      const user = await User.findById(userId);
      user.createdEvents.push(savedEvent._id);
      await user.save();
    }
    res.status(201).json(savedEvent);

  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
    console.log(error.message);
  }
}
