const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
  try {
    const locals = {
      title: 'Blog',
      description: 'Simple Blog.'
    };

    //number of posts per page
    let perPage = 3;
    let page = req.query.page || 1

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec()

    const count = await Post.count()
    const nextPage = parseInt(page + 1)
    const hasNextPage = nextPage <= Math.ceil(count / perPage)


    // const data = await Post.find()
    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }
});


//GET, POST:id
router.get('/post/:id', async (req, res) => {
  try {

    let slug = req.params.id

    const data = await Post.findById({ _id: slug })

    const locals = {
      title: data.title,
      description: 'Simple Blog'
    }

    res.render('post', {
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }
});


//POST, POST:search
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

//GET, About
router.get('/about', (req, res) => {
  res.render('about', { currentRoute: '/about' });
});

//GET, Blog
router.get('/blog', async (req, res) => {

  try {
    const locals = {
      title: "Blog",
      description: "Simple Blog."
    }
    const data = await Post.find().sort({ createdAt: -1 })

    res.render('blog', {
      locals,
      data,
      currentRoute: '/blog'
    });
  }
  catch (error) {
    console.log(error);
  }
});


//POST, Blog

// router.post('/blog', async(req, res) => {
//   res.render('blog', { data: req.body });
// });


//GET, 404
// router.get('*', (req, res) => {
//   res.render('404');
// });

// async function insertPostData() {
//   try {
//     const postData = [
//       {
//         title: 'Building a blog',
//         body: 'This is the body text'
//       },
//       {
//         title: 'Building a blog',
//         body: 'This is the body text'
//       },
//       {
//         title: 'Building a blog',
//         body: 'This is the body text'
//       },
//     ];

//     const insertedPosts = await Post.insertMany(postData);
//     console.log('Inserted posts:', insertedPosts);
//   } catch (error) {
//     console.error('Error inserting post data:', error.message);
//   }
// }

// // Call the function to insert post data when the server starts
// insertPostData();

module.exports = router;
