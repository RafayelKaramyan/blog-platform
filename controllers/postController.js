const Post = require('../models/Post');

module.exports = {
  createPost: async (req, res) => {
    try {
      const { title, body } = req.body;
      const author = req.user.id;

      const post = new Post({ title, body, author });
      await post.save();

      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getPosts: async (req, res) => {
    try {
      const posts = await Post.find().populate('author', 'username');
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { title, body } = req.body;
      const postId = req.params.id;
      const userId = req.user.id;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.author.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      post.title = title;
      post.body = body;
      post.updatedAt = new Date();
      await post.save();

      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deletePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.id;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.author.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      await post.remove();

      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};
