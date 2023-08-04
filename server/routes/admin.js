const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin'

const jwtSecret = process.env.JWT_SECRET

// GET, check login page

const authMiddleware = async (req, res, next) => {

  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
    // res.redirect('/admin');
  }

}

//GET, Admin-login page

router.get('/admin', async (req, res) => {

  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog."
    }

    res.render('admin/index', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }

});


//POST, Admin-check login page

router.post('/admin', async (req, res) => {

  try {
    const { username, password } = req.body;
    // console.log(req.body);

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });

    res.redirect('/dashboard');

  } catch (error) {
    console.log(error);
  }

});



// GET, Dashboard page

router.get('/dashboard', authMiddleware, async (req, res) => {

  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog."
    }
    const data = await Post.find().sort({ createdAt: -1 })

    res.render('admin/dashboard', { locals, data, layout: adminLayout });
  }
  catch (error) {
    console.log(error);
  }

});

// GET, Admin - add post page

router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: 'Simple Blog.'
    }

    const data = await Post.find();
    res.render('admin/add-post', {
      locals,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});

// POST / Add Post

router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body
      });

      await Post.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }
});


// GET, Admin - edit post page

router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {

    const locals = {
      title: "Edit Post",
      description: "Simple Blog.",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout
    })

  } catch (error) {
    console.log(error);
  }

});

// PUT, Admin - edit post

router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {

    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });

    res.redirect(`/edit-post/${req.params.id}`);

  } catch (error) {
    console.log(error);
  }

});


// DELETE , Admin - Delete Post

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

  try {
    await Post.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }

});

//GET, Admin-register page

// router.post('/admin', async (req, res) => {

//   try {
//     const { username, password } = req.body;
//     // console.log(req.body);
//     if (req.body.username === 'admin' && req.body.password === 'admin') {
//       res.send('Login success');
//     } else {
//       res.send('Login failed');
//     }

//   } catch (error) {
//     console.log(error);
//   }

// });



//POST, Admin-register page

router.post('/register', async (req, res) => {

  try {
    const { username, password } = req.body;
    const hasPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        username,
        password: hasPassword
      });
      res.status(201).json({ message: 'User created', user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: 'User already exist' });
      }
      res.status(500).json({ message: 'Error creating user' });
    }
  } catch (error) {
    console.log(error);
  }

});


//GET, Admin-logout page

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  //res.json({ message: 'Logout successful.'});
  res.redirect('/');
});

module.exports = router;