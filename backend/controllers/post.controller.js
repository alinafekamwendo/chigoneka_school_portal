// import Post from '../models/post.model.js';
// import { errorHandler } from '../utils/error.js';

// export const create = async (req, res, next) => {
//   if (!req.user.isAdmin) {
//     return next(errorHandler(403, 'You are not allowed to create a post'));
//   }
//   if (!req.body.title || !req.body.content) {
//     return next(errorHandler(400, 'Please provide all required fields'));
//   }
//   const slug = req.body.title
//     .split(' ')
//     .join('-')
//     .toLowerCase()
//     .replace(/[^a-zA-Z0-9-]/g, '');
//   const newPost = new Post({
//     ...req.body,
//     slug,
//     userId: req.user.id,
//   });
//   try {
//     const savedPost = await newPost.save();
//     res.status(201).json(savedPost);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getposts = async (req, res, next) => {
//   try {
//     const startIndex = parseInt(req.query.startIndex) || 0;
//     const limit = parseInt(req.query.limit) || 9;
//     const sortDirection = req.query.order === 'asc' ? 1 : -1;
//     const posts = await Post.find({
//       ...(req.query.userId && { userId: req.query.userId }),
//       ...(req.query.category && { category: req.query.category }),
//       ...(req.query.slug && { slug: req.query.slug }),
//       ...(req.query.postId && { _id: req.query.postId }),
//       ...(req.query.searchTerm && {
//         $or: [
//           { title: { $regex: req.query.searchTerm, $options: 'i' } },
//           { content: { $regex: req.query.searchTerm, $options: 'i' } },
//         ],
//       }),
//     })
//       .sort({ updatedAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit);

//     const totalPosts = await Post.countDocuments();

//     const now = new Date();

//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     );

//     const lastMonthPosts = await Post.countDocuments({
//       createdAt: { $gte: oneMonthAgo },
//     });

//     res.status(200).json({
//       posts,
//       totalPosts,
//       lastMonthPosts,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deletepost = async (req, res, next) => {
//   if (!req.user.isAdmin || req.user.id !== req.params.userId) {
//     return next(errorHandler(403, 'You are not allowed to delete this post'));
//   }
//   try {
//     await Post.findByIdAndDelete(req.params.postId);
//     res.status(200).json('The post has been deleted');
//   } catch (error) {
//     next(error);
//   }
// };

// export const updatepost = async (req, res, next) => {
//   if (!req.user.isAdmin || req.user.id !== req.params.userId) {
//     return next(errorHandler(403, 'You are not allowed to update this post'));
//   }
//   try {
//     const updatedPost = await Post.findByIdAndUpdate(
//       req.params.postId,
//       {
//         $set: {
//           title: req.body.title,
//           content: req.body.content,
//           category: req.body.category,
//           image: req.body.image,
//         },
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedPost);
//   } catch (error) {
//     next(error);
//   }
// };

const { Post} = require('../models');
const { errorHandler } = require('../utils/error.js');
const { Op } = require('sequelize');


const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
console.log('cookies token'),
console.log(req.body);
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

  try {
    const newPost = await Post.create({
      ...req.body,
      slug,
      userId: req.user.id,
    });

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};
// const getPosts = async (req, res, next) => {
//   try {
//     console.log({Post});

//     const startIndex = parseInt(req.query.startIndex, 10) || 0;
//     const limit = parseInt(req.query.limit, 10) || 9;
//     const sortDirection = req.query.order === 'asc' ? 'ASC' : 'DESC';

//     const whereConditions = {
//       ...(req.query.userId && { userId: req.query.userId }),
//       ...(req.query.category && { category: req.query.category }),
//       ...(req.query.slug && { slug: req.query.slug }),
//       ...(req.query.postId && { id: req.query.postId }),
//       ...(req.query.searchTerm && {
//         [models.Sequelize.Op.or]: [
//           { title: { [models.Sequelize.Op.iLike]: `%${req.query.searchTerm}%` } },
//           { content: { [models.Sequelize.Op.iLike]: `%${req.query.searchTerm}%` } },
//         ],
//       }),
//     };

//     const { rows: posts, count: totalPosts } = await Post.findAndCountAll({
//       where: whereConditions,
//       order: [['updatedAt', sortDirection]],
//       offset: startIndex,
//       limit,
//     });

//     const now = new Date();
//     const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

//     const lastMonthPosts = await Post.count({
//       where: { createdAt: { [models.Sequelize.Op.gte]: oneMonthAgo } },
//     });

//     res.status(200).json({ posts, totalPosts, lastMonthPosts });
//   } catch (error) {
//     next(error);
//   }
// };

 // Assuming your Post model is exported here

const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.order === 'asc' ? 'ASC' : 'DESC';

    // Build the "where" clause dynamically
    const whereConditions = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { id: req.query.postId }),
      ...(req.query.searchTerm && {
        [Op.or]: [
          { title: { [Op.iLike]: `%${req.query.searchTerm}%` } },
          { content: { [Op.iLike]: `%${req.query.searchTerm}%` } },
        ],
      }),
    };

    // Fetch posts with pagination and sorting
    const { rows: posts, count: totalPosts } = await Post.findAndCountAll({
      where: whereConditions,
      order: [['updatedAt', sortDirection]],
      offset: startIndex,
      limit,
    });

    // Calculate the number of posts created in the last month
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const lastMonthPosts = await Post.count({
      where: {
        createdAt: {
          [Op.gte]: oneMonthAgo,
        },
      },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};




const deletePost = async (req, res, next) => {
  try {
    console.log("delete post reached");
    const post = await Post.findByPk(req.params.postId);
    if (!post) {
      return next(errorHandler(404, 'Post not found'));
    }

    if (!req.user.isAdmin && req.user.id !== post.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this post'));
    }

    await post.destroy();

    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.postId);

    if (!post) {
      return next(errorHandler(404, 'Post not found'));
    }

    if (!req.user.isAdmin && req.user.id !== post.userId) {
      return next(errorHandler(403, 'You are not allowed to update this post'));
    }

    const updatedPost = await post.update({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      image: req.body.image,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

module.exports={createPost,getPosts,deletePost,updatePost}
