const Post = require('../models/postModel');
const Notification=require('../models/notificationModel.js');

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

exports.createPost = async (req, res) => {
  const { text, image,isPublic } = req.body;
  try {
    const newPost = new Post({
      userId: req.user.id,
      text,
      image,
      isPublic,
      likes: [],
      dislikes: []
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post' });
  }
};

exports.updatePost = async (req, res) => {
  const { text, image,isPublic } = req.body;
  try {
    const updated = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { text, image,isPublic },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update post' });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  try {
    const post = await Post.findOneAndDelete({ _id: postId, userId });
    if (!post) return res.status(404).json({ message: 'Post not found ' });
    await Notification.deleteMany({ postId });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

exports.getPublicPosts=async(req,res)=>{
  try {
    const publicPosts = await Post.find({ isPublic: true }).sort({ createdAt: -1 });
    res.status(200).json(publicPosts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch public posts' });
  }
};

exports.handleLike = async (req, res) => {
  const postId = req.params.id;
  const username = req.user.username;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const hasLiked = post.likes.includes(username);
    const hasDisliked = post.dislikes.includes(username);

    if (hasLiked) return res.status(200).json(post);

    if (hasDisliked) {
      post.dislikes = post.dislikes.filter(user => user !== username);
      await Notification.deleteOne({ userId, postId, type: 'disliked' });
    }

    post.likes.push(username);
    await post.save();

    await Notification.create({ userId, postId, type: 'liked' });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to like post' });
  }
};

exports.handleDislike = async (req, res) => {
  const postId = req.params.id;
  const username = req.user.username;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const hasDisliked = post.dislikes.includes(username);
    const hasLiked = post.likes.includes(username);

    if (hasDisliked) return res.status(200).json(post);

    if (hasLiked) {
      post.likes = post.likes.filter(user => user !== username);
      // Remove any existing 'liked' notification from this user for this post
      await Notification.deleteOne({ userId, postId, type: 'liked' });
    }

    post.dislikes.push(username);
    await post.save();

    // Create a 'disliked' notification for this post
    await Notification.create({ userId, postId, type: 'disliked' });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to dislike post' });
  }
};