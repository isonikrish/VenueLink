import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    unique: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: ["private", "public"],
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventPrice: {
    type: String,
    required: true,
    enum: ["free", "paid"],
  },
  eventPriceValue: {
    type: Number,
    required: function () {
      return this.eventPrice === "paid"; // Required only if the event is paid
    },
  },
  eventTimeFrom: {
    type: String,
    required: true,
  },
  eventTimeTo: {
    type: String,
    required: true,
  },
  eventLocation: {
    type: String,
    required: true,
    enum: ["online", "offline"],
  },
  eventLink: {
    type: String,
    required: function () {
      return this.eventLocation === "online"; // Required if the event is online
    },
  },
  eventAddress: {
    type: String,
    required: function () {
      return this.eventLocation === "offline"; // Required if the event is offline
    },
  },
  eventThumbnail: {
    type: String,
    required: true,
  },
  coorganizerEmail: [
    {
      type: String,
    },
  ],
  organizer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  attendees: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      code: String,
      checkedIn: {
        type: Boolean,
        
      }
    },
  ],
  status: {
    type: String,
    enum: ["Upcoming", "Ongoing", "Ended"],
    default: "Upcoming"
  },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
