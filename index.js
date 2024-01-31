const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/basic-blog-platform';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const blogPostSchema = new mongoose.Schema({
  title: String,
  body: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

app.get('/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/posts/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/posts', async (req, res) => {
  const { title, body, author } = req.body;

  try {
    const newPost = new BlogPost({ title, body, author });
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.patch('/posts/:postId', async (req, res) => {
  const postId = req.params.postId;
  const updates = req.body;

  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(postId, updates, { new: true });
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/posts/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    const deletedPost = await BlogPost.findByIdAndRemove(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(deletedPost);
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.send('Hello, Basic-Blog-Platform!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
  }); 