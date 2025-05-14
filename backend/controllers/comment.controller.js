
// const { Comment } =require('../models');
// const { errorHandler } =require('../utils/error.js');


// const createComment = async (req, res, next) => {
//   try {
//     const { content, postId, userId } = req.body;

//     if (userId !== req.user.id) {
//       return next(errorHandler(403, 'You are not allowed to create this comment'));
//     }

//     const newComment = await Comment.create({
//       content,
//       postId,
//       userId,
//     });

//     res.status(200).json(newComment);
//   } catch (error) {
//     next(error);
//   }
// };

// const getPostComments = async (req, res, next) => {
//   try {
//     const comments = await Comment.findAll({
//       where: { postId: req.params.postId },
//       order: [['createdAt', 'DESC']],
//     });
//     res.status(200).json(comments);
//   } catch (error) {
//     next(error);
//   }
// };

// const likeComment = async (req, res, next) => {
//   try {
//     const comment = await Comment.findByPk(req.params.commentId);
//     if (!comment) {
//       return next(errorHandler(404, 'Comment not found'));
//     }

//     const likes = comment.likes || [];
//     const userIndex = likes.indexOf(req.user.id);

//     if (userIndex === -1) {
//       likes.push(req.user.id);
//       comment.numberOfLikes += 1;
//     } else {
//       likes.splice(userIndex, 1);
//       comment.numberOfLikes -= 1;
//     }

//     comment.likes = likes;
//     await comment.save();

//     res.status(200).json(comment);
//   } catch (error) {
//     next(error);
//   }
// };

// const editComment = async (req, res, next) => {
//   try {
//     const comment = await Comment.findByPk(req.params.commentId);
//     if (!comment) {
//       return next(errorHandler(404, 'Comment not found'));
//     }

//     if (comment.userId !== req.user.id && !req.user.isAdmin) {
//       return next(errorHandler(403, 'You are not allowed to edit this comment'));
//     }

//     comment.content = req.body.content;
//     await comment.save();

//     res.status(200).json(comment);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteComment = async (req, res, next) => {
//   try {
//     const comment = await Comment.findByPk(req.params.commentId);
//     if (!comment) {
//       return next(errorHandler(404, 'Comment not found'));
//     }

//     if (comment.userId !== req.user.id && !req.user.isAdmin) {
//       return next(errorHandler(403, 'You are not allowed to delete this comment'));
//     }

//     await comment.destroy();
//     res.status(200).json('Comment has been deleted');
//   } catch (error) {
//     next(error);
//   }
// };

// const getComments = async (req, res, next) => {
//   if (!req.user.isAdmin) {
//     return next(errorHandler(403, 'You are not allowed to get all comments'));
//   }

//   try {
//     const startIndex = parseInt(req.query.startIndex, 10) || 0;
//     const limit = parseInt(req.query.limit, 10) || 9;
//     const sortDirection = req.query.sort === 'desc' ? 'DESC' : 'ASC';

//     const { rows: comments, count: totalComments } = await Comment.findAndCountAll({
//       order: [['createdAt', sortDirection]],
//       offset: startIndex,
//       limit,
//     });

//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     const lastMonthComments = await Comment.count({
//       where: {
//         createdAt: {
//           [models.Sequelize.Op.gte]: oneMonthAgo,
//         },
//       },
//     });

//     res.status(200).json({ comments, totalComments, lastMonthComments });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports={createComment,getPostComments,likeComment,editComment,deleteComment,getComments};

const { Comment } = require('../models');
const { errorHandler } = require('../utils/error.js');

const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, 'You are not allowed to create this comment'));
    }

    const newComment = await Comment.create({
      content,
      postId,
      userId,
    });

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    const likes = comment.likes || [];
    const userIndex = likes.indexOf(req.user.id);

    if (userIndex === -1) {
      likes.push(req.user.id);
      comment.numberOfLikes += 1;
    } else {
      likes.splice(userIndex, 1);
      comment.numberOfLikes -= 1;
    }

    await Comment.update(
      { likes, numberOfLikes: comment.numberOfLikes },
      { where: { id: req.params.commentId } }
    );

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to edit this comment'));
    }

    await Comment.update(
      { content: req.body.content },
      { where: { id: req.params.commentId } }
    );

    const updatedComment = await Comment.findByPk(req.params.commentId);
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to delete this comment'));
    }

    await Comment.destroy({ where: { id: req.params.commentId } });
    res.status(200).json('Comment has been deleted');
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to get all comments'));
  }

  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.sort === 'desc' ? 'DESC' : 'ASC';

    const { rows: comments, count: totalComments } = await Comment.findAndCountAll({
      order: [['createdAt', sortDirection]],
      offset: startIndex,
      limit,
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthComments = await Comment.count({
      where: {
        createdAt: {
          [models.Sequelize.Op.gte]: oneMonthAgo,
        },
      },
    });

    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getComments
};
