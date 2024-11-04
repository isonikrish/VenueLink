import User from "../models/user.js";
import Event from "../models/event.js"; // Optional: To validate if the event exists

export async function addToBookMark(req, res) {
  try {
    const { id } = req.body; // Event ID
    const userId = req.user._id; // Assume you have middleware that attaches user info to req

    if (!id) return res.status(400).json({ msg: "Event ID not provided for bookmark" });
    if (!userId) return res.status(400).json({ msg: "User ID not provided for bookmark" });

    // Optional: Check if the event exists
    const eventExists = await Event.exists({ _id: id });
    if (!eventExists) {
      return res.status(404).json({ msg: "Event not found" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the event is already bookmarked
    if (user.bookmarkedEvents.includes(id)) {
      return res.status(409).json({ msg: "Event is already bookmarked" });
    }

    // Add the event ID to the bookmarked events
    user.bookmarkedEvents.push(id);
    await user.save();

    return res.status(200).json({ msg: "Event bookmarked successfully" });
  } catch (error) {
    console.error("Error bookmarking event:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getBookmarkedEvents(req, res) {
  try {
      const userId = req.user._id; // Assuming you have middleware that sets req.user
      
      // Find the user and populate their bookmarked events
      const user = await User.findById(userId).populate({
        path: 'bookmarkedEvents',
        populate: {
          path: 'organizer',
          select: 'fullname email', 
        },
      });
    
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      
      // Return the bookmarked events
      res.status(200).json({ bookmarkedEvents: user.bookmarkedEvents });
  } catch (error) {
      console.error('Error fetching bookmarked events:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}
