const Notification = require('../models/notificationModel.js');
const User = require('../models/userModel.js')
const Post = require('../models/postModel.js')

exports.getNotifications = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const userPosts = await Post.find({ userId: user._id }).select('_id');
        const postIds = userPosts.map(post => post._id);

        const notifications = await Notification.find({ postId: { $in: postIds } })
            .sort({ timestamp: -1 })
            .populate('userId', 'username')
            .populate('postId', 'text');

        res.status(200).json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateNotification = async (req, res) => {
    const { notificationId } = req.params;
    try {
        const updated = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json(updated);
    }
    catch (err) {
        console.error('Error updating notification:', err);
        res.status(500).json({ message: 'Server error' });
    }

};