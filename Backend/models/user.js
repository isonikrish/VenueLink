import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicUrl: {
      type: String, // Optional profile picture URL
      default: "",
    },
    bookmarkedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event", // Array of bookmarked events (for alerts or easy access)
      },
    ],
    checkedInEvents: [
      {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // Reference to the event
        checkedInAt: { type: Date }, // Date of check-in
      },
    ],
    joinedEvents: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // Reference to the event
    ],
    createdEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event", // Reference to
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
