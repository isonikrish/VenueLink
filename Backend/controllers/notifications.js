import Notification from "../models/notification.js";
import User from "../models/user.js";
export async function handleMyNotifications(req, res) {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const notifications = await Notification.find({ to: userId }).populate("event");

    if (!notifications) {
      return res.status(200).json([]); // return empty array
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function deleteMyNotifications(req,res){
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await Notification.deleteMany({ to: userId })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No notifications found to delete" });
    }

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}