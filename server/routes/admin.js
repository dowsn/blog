// ENCRYPTION AND JwT
import bcrypt from 'bcrypt';
import express from 'express'; // import express
import jwt from 'jsonwebtoken';
// MODELS
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router(); // we need router

const jwtSecret = process.env.JWT_SECRET


// set layout
const adminLayout = '../views/layouts/admin';

const authMiddleWare = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // render better
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

/************* GET ADMIN / LOGIN PAGE***********/

router.get('/admin', async (req, res) => {
  // res.send('hello');

  // check if admin

  try {
    const locals = {
      title: 'Admin',
      description: 'Simple blog',
    };

    res.render('admin/index', {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    // route to 404?
    console.log(error);
  }
});

/************* GET ADMIN DASHBOARD***********/

// this is pw protected now with middleware
router.get('/dashboard', authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: 'Simple blog',
    };

    const data = await Post.find();

    res.render('admin/dashboard', {
      data,
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    // route to 404?
    console.log(error);
  }
});

/************* GET POST NEW***********/

// this is pw protected now with middleware
router.get('/add-post', authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: 'Simple blog',
    };

    res.render('admin/add-post', {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    // route to 404?
    console.log(error);
  }
});

/************* GET EDIT NEW***********/

// this is pw protected now with middleware
router.get('/edit-post/:id', authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: 'Edit Post',
      description: 'Simple blog',
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render('admin/edit-post', {
      locals,
      layout: adminLayout,
      data,
    });
  } catch (error) {
    // route to 404?
    console.log(error);
  }
});

/*************  POST NEW POST ***********/

// this is pw protected now with middleware
router.post('/add-post', authMiddleWare, async (req, res) => {
  try {
    const data = req.body;

    try {
      const newPost = await new Post({
        title: req.body.title,
        body: req.body.body,
      });

      await Post.create(newPost);

      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    // route to 404?
    console.log(error);
  }
});

/*************  PUT NEW POST ***********/

// this is pw protected now with middleware
router.put('/edit-post/:id', authMiddleWare, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });

    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

/*************  Delete  POST ***********/

// this is pw protected now with middleware
router.delete('/delete-post/:id', authMiddleWare, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });

    res.redirect(`/dashboard`);
  } catch (error) {
    console.log(error);
  }
});

/************* POST  - Admin check login *********/

router.post('/login', async (req, res) => {
  // res.send('hello');

  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    // saving to cookie
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });

    res.redirect('/dashboard');
  } catch (error) {
    // route to 404?
    console.log(error);
  }
});

/************* POST  - Admin register *********/

router.post('/register', async (req, res) => {
  // res.send('hello');

  console.log('as');
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); // salt is 10

    try {
      const user = User.create({ username, password: hashedPassword });
      res.status(201).json({ message: 'user created' });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: 'user already in use' });
      }
      res.status(500).json({ message: 'server error' });
    }
  } catch (error) {
    // route to 404?
    console.log(error);
  }
});

// GET ADMIN LOGOUT

// this is pw protected now with middleware
router.get('/logout', authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: 'Logout',
      description: 'Simple blog',
    };

    res.clearCookie('token');

    res.redirect('/admin');
  } catch (error) {
    // route to 404?
    console.log(error);
  }
});

export default router;