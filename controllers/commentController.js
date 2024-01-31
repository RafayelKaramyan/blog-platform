const Comment = require('../models/Comment');

module.exports = {
  createComment: async (req, res) => {
    try {
      const { content } = req.body;
      const author = req.user.id; // Assuming you have user information in req.user
      const postId = req.params.postId;

      const comment = new Comment({ content, author, post: postId });
      await comment.save();

      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getCommentsByPost: async (req, res) => {
    try {
      const postId = req.params.postId;
      const comments = await Comment.find({ post: postId }).populate('author', 'username'); // Populate author field with username
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.user.id;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      if (comment.author.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      await comment.remove();

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};
