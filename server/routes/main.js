import express from 'express';
import Post from '../models/Post.js';

const router = express.Router(); // we need router

// homepage
router.get('', async (req, res) => {
  // res.send('hello');

  /************* GET ***********/

  try {
    // to get data before
    const locals = {
      title: 'Homepage',
      description: 'Simple blog',
    };

    let perPage = 10;
    let page = req.query.page || 1;

    // const data = await Post.find(); // getting all data
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
      locals,
      data,
      nextPage: hasNextPage ? nextPage : null,
      page,
      currentRoute: '/',
    });
  } catch (error) {
    // route to 404?
    console.log(error);
  }
});

router.get('/post/:id', async (req, res) => {
  // res.send('hello');

  let slug = req.params.id;

  try {
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title, // title is title of the post
      description: 'Simple blog',
    };

    res.render('post', {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    // route to 404?
    console.log(error);
  }
});

// function insertPostData(){
//   Post.insertMany([
//     {
//       title: "Building a Webpage",
//       body: 'body',

//     }
//   ])
// }

// insertPostData()

/************* POST ***********/

router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: 'Search',
      description: 'Simple blog',
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
      ],
    });

    res.render('search', { data, locals });
  } catch (error) {
    // route to 404?
    console.log(error);
  }
});

router.get('/about', (req, res) => {
  // res.send('hello');
  res.render('about', {
    currentRoute: '/about',
  });
});

export default router;
