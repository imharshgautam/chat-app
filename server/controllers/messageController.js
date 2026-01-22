import User from "../models/user.js";
import Message from "../routes/Message.js";

// get all users except the logged in user

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // count number of messages not seen
        const unseenMessages = {};

        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false,
            });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });

        await Promise.all(promises);

        res.json({
            success: true,
            users: filteredUsers,
            unseenMessages,
        });
    } catch (error) {
        console.log(error.Message);
        res.status(500).json({ success: false, message: error.message });
    }
};


// get all messages for selected user

export const getMessages = async(req, res)=>{
    try {
        
    } catch (error) {
        console.log(error.Message)
        res.status(500).json({ success: false, message: error.message });
        
    }

}