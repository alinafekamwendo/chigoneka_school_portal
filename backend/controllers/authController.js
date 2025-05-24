const { User, Teacher, Parent, Student, Admin } = require("../models"); // Import Admin model
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Joi = require("joi");
const { sequelize } = require("../models");
const { get } = require("http");


//for token generation
// Add these at the top with other requires
const cookie = require('cookie');

// Update token generation function
// Add these at the top of your auth controller
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30m' } // Short expiration for access token
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // Longer expiration for refresh token
  );
};
// Add this new endpoint for token refresh
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token required",
        shouldLogout: true, // Flag to tell client to logout
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if user exists
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: ["id", "role"],
    });

    if (!user) {
      // Clear invalid refresh token
      res.clearCookie("refreshToken");
      return res.status(403).json({
        error: "Invalid refresh token",
        shouldLogout: true,
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Set new refresh token in HTTP-only cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      token: newAccessToken,
      expiresIn: 15 * 60 * 1000, // Tell client when token will expire (15 minutes)
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    // Clear invalid refresh token
    res.clearCookie("refreshToken");

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        error: "Refresh token expired",
        shouldLogout: true,
      });
    }
    return res.status(403).json({
      error: "Invalid refresh token",
      shouldLogout: true,
    });
  }
};

// Update login function
const loginUser = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["deletedAt"] },
    });

    if (!user) {
      return res.status(404).json({ error: "Account not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token in HTTP-only cookie
    res.setHeader('Set-Cookie', cookie.serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    }));

    const profilePhotoUrl = user.profilePhoto
      ? `${req.protocol}://${req.get("host")}${user.profilePhoto}`
      : null;

    const responseData = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        sex: user.sex,
        profilePhoto: profilePhotoUrl,
      },
      token: accessToken,
    };

    if (user.role === "admin") {
      const admin = await Admin.findOne({ where: { userId: user.id } });
      responseData.user.level = admin.level;
    }

    if (user.role === "teacher" && user.teacher) {
      const teacher = await Teacher.findOne({ where: { userId: user.id } });
      responseData.user.qualifications = teacher.qualifications;
      responseData.user.subjects = teacher.subjects;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
};

// Update logout function
const logout = async (req, res) => {
  try {
    // Clear refresh token cookie
    res.setHeader('Set-Cookie', cookie.serialize('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/'
    }));

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Failed to logout" });
  }
};



// Configure Multer storage (unchanged)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/profilephoto");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.body.username}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Helper function to generate JWT token (unchanged)
const generateToken = (user) => {
  return jwt.sign(
    { username: user.username, id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "4h" }
  );
};

// Validation schema for user creation (updated with admin level)
const userSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "any.required": "First name is required",
    "string.empty": "First name cannot be empty",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Last name is required",
    "string.empty": "Last name cannot be empty",
  }),
  username: Joi.string().required().messages({
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty",
  }),
  role: Joi.string()
    .valid("admin", "parent", "teacher", "student")
    .required()
    .messages({
      "any.required": "Role is required",
      "any.only": "Role must be one of: admin, parent, teacher, student",
    }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password cannot be empty",
  }),
  address: Joi.string().required().messages({
    "any.required": "Address is required",
    "string.empty": "Address cannot be empty",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email address",
    "string.empty": "Email cannot be empty",
  }),
  phone: Joi.string().required().messages({
    "any.required": "Phone number is required",
    "string.empty": "Phone number cannot be empty",
  }),
  sex: Joi.string().valid("MALE", "FEMALE").required().messages({
    "any.required": "Sex is required",
    "any.only": "Sex must be one of: MALE, FEMALE",
  }),
});

// Extended validation for specific roles
const teacherSchema = Joi.object({
  qualifications: Joi.array().items(Joi.string()).optional(),
  subjects: Joi.array().items(Joi.string()).optional(),
});

const parentSchema = Joi.object({});

const studentSchema = Joi.object({
  parentId: Joi.string().guid().required(),
  alte_guardian_Id: Joi.string().guid().optional(),
});

const adminSchema = Joi.object({
  level: Joi.string().valid("regular", "super").default("regular"),
});

// Create a new user with role-specific data (updated with admin creation)
const createUser = async (req, res) => {
  const nw = req.body;
  console.log(nw);
  try {
    upload.single("profilePhoto")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "Error uploading file" });
      }

      const {
        firstName,
        lastName,
        username,
        role,
        password,
        address,
        email,
        phone,
        sex,
        qualifications,
        subjects,
        parentId,
        alte_guardian_Id,
        level, // Admin specific field
      } = req.body;

      // Validate the input data
      const { error } = userSchema.validate(
        {
          firstName,
          lastName,
          username,
          role,
          password,
          address,
          email,
          phone,
          sex,
        },
        { abortEarly: false }
      );

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ errors });
      }

      // Validate role-specific data
      let roleValidationError;
      switch (role.toLowerCase()) {
        case "teacher":
          roleValidationError = teacherSchema.validate({
            qualifications,
            subjects,
          }).error;
          break;
        case "student":
          roleValidationError = studentSchema.validate({
            parentId,
          }).error;
          break;
        case "parent":
          roleValidationError = parentSchema.validate({}).error;
          break;
        case "admin":
          roleValidationError = adminSchema.validate({ level }).error;
          break;
      }

      if (roleValidationError) {
        const errors = roleValidationError.details.map(
          (detail) => detail.message
        );
        return res.status(400).json({ errors });
      }

      // Check if username, email, or phone already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }, { phone }],
        },
      });

      if (existingUser) {
        const errors = [];
        if (existingUser.username === username) {
          errors.push("Username already exists");
        }
        if (existingUser.email === email) {
          errors.push("Email already exists");
        }
        if (existingUser.phone === phone) {
          errors.push("Phone number already exists");
        }
        return res.status(400).json({ errors });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const lowerCaseRole = role.toLowerCase();
      const upperCaseSex = sex.toUpperCase();

      // Construct profile picture URL if file is uploaded
      let profilePhotoUrl = null;
      if (req.file) {
        profilePhotoUrl = `/uploads/profilephotos/${req.file.filename}`;
      }

      // Start a transaction to ensure data consistency
      const transaction = await sequelize.transaction();

      try {
        // Create the user
        const user = await User.create(
          {
            firstName,
            lastName,
            username,
            role: lowerCaseRole,
            password: hashedPassword,
            address,
            email,
            phone,
            sex: upperCaseSex,
            profilePhoto: profilePhotoUrl,
          },
          { transaction }
        );

        // Create role-specific records
        switch (lowerCaseRole) {
          case "teacher":
            await Teacher.create(
              {
                userId: user.id,
                qualifications: qualifications || [],
                subjects: subjects || [],
              },
              { transaction }
            );
            break;
          case "parent":
            await Parent.create(
              {
                userId: user.id,
              },
              { transaction }
            );
            break;
          case "student":
            const parent = await Parent.findByPk(parentId, { transaction });
            if (parent) {
              await Student.create(
                {
                  userId: user.id,
                  parentId,
                  alte_guardian_Id: alte_guardian_Id || null,
                  scores: [],
                },
                { transaction }
              );
            } else {
              res.status(400).json({ error: "Parent not found" });
              return;
            }
            break;
          case "admin":
            await Admin.create(
              {
                userId: user.id,
                level: level || "regular",
              },
              { transaction }
            );
            break;
        }

        // Commit the transaction
        await transaction.commit();

        // Generate a token for the new user
        const token = generateToken(user);

        res.status(200).json({ user, token });
      } catch (error) {
        // Rollback the transaction if any error occurs
        await transaction.rollback();
        throw error;
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: error.message || "An unexpected error occurred" });
  }
};

// Get all users with their role-specific data (updated with admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "deletedAt"] },
      paranoid: true,
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get current user based on JWT token
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Base query configuration
    const baseQuery = {
      where: { id: user.id },
      attributes: { exclude: ["password", "deletedAt"] },
    };

    // Determine which role-specific model to include based on the user's role
    let include = [];
    switch (user.role) {
      case "teacher":
        include.push({ model: Teacher, as: "teacher" });
        break;
      case "parent":
        include.push({ model: Parent, as: "parent" });
        break;
      case "student":
        include.push({
          model: Student,
          as: "student",
          include: [{ model: Parent, as: "parent" }],
        });
        break;
      case "admin":
        include.push({ model: Admin, as: "admin" });
        break;
    }

    // Fetch user with only the relevant role data
    const fullUser = await User.findOne({
      ...baseQuery,
      include: include.length ? include : undefined,
    });

    if (!fullUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(fullUser);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Failed to fetch current user" });
  }
};

// Get a user by ID with role-specific data (updated with admin)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "deletedAt"] },
      include: [
        {
          model: Teacher,
          as: "teacher",
          required: false,
        },
        {
          model: Parent,
          as: "parent",
          required: false,
        },
        {
          model: Student,
          as: "student",
          required: false,
          include: [
            {
              model: Parent,
              as: "parent",
            },
          ],
        },
        {
          model: Admin,
          as: "admin",
          required: false,
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Update a user and their role-specific data (updated with admin)
const updateUser = async (req, res) => {
  try {
    upload.single("profilePhoto")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "Error uploading file" });
      }

      const { id } = req.params;
      const {
        firstName,
        lastName,
        username,
        role,
        email,
        phone,
        password,
        sex,
        qualifications,
        subjects,
        parentId,
        alte_guardian_Id,
        level, // Admin specific field
      } = req.body;

      const transaction = await sequelize.transaction();

      try {
        const user = await User.findByPk(id, { transaction });
        if (!user) {
          await transaction.rollback();
          return res.status(404).json({ error: "User not found" });
        }

        // Hash new password if provided
        let updatedFields = { firstName, lastName, username, email, phone };
        if (password) {
          updatedFields.password = await bcrypt.hash(password, 10);
        }
        if (sex) {
          updatedFields.sex = sex.toUpperCase();
        }

        // Handle profile picture update
        if (req.file) {
          // Delete the old profile picture if exists
          if (user.profilePhoto) {
            const oldPhotoPath = path.join(__dirname, "..", user.profilePhoto);
            if (fs.existsSync(oldPhotoPath)) {
              fs.unlinkSync(oldPhotoPath);
            }
          }
          updatedFields.profilePhoto = `/uploads/profilephotos/${req.file.filename}`;
        }

        await User.update(updatedFields, {
          where: { id },
          transaction,
        });

        // Update role-specific data
        switch (user.role) {
          case "teacher":
            if (qualifications || subjects) {
              await Teacher.update(
                {
                  qualifications: qualifications || [],
                  subjects: subjects || [],
                },
                {
                  where: { userId: id },
                  transaction,
                }
              );
            }
            break;
          case "student":
            if (parentId || alte_guardian_Id) {
              await Student.update(
                {
                  parentId,
                  alte_guardian_Id: alte_guardian_Id || null,
                },
                {
                  where: { userId: id },
                  transaction,
                }
              );
            }
            break;
          case "admin":
            if (level) {
              await Admin.update(
                {
                  level,
                },
                {
                  where: { id },
                  transaction,
                }
              );
            }
            break;
        }

        await transaction.commit();

        const updatedUser = await User.findByPk(id, {
          attributes: { exclude: ["password", "deletedAt"] },
          include: [
            {
              model: Teacher,
              as: "teacher",
              required: false,
            },
            {
              model: Parent,
              as: "parent",
              required: false,
            },
            {
              model: Student,
              as: "student",
              required: false,
            },
            {
              model: Admin,
              as: "admin",
              required: false,
            },
          ],
        });

        res.status(200).json(updatedUser);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Serve uploaded files (unchanged)
const serveProfilePhoto = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads", filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
};

// Soft delete a user and their role-specific data (updated with admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await sequelize.transaction();

    try {
      const user = await User.findByPk(id, { transaction });
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: "User not found" });
      }

      // Delete role-specific record first
      switch (user.role) {
        case "teacher":
          await Teacher.destroy({
            where: { userId: id },
            transaction,
          });
          break;
        case "parent":
          await Parent.destroy({
            where: { userId: id },
            transaction,
          });
          break;
        case "student":
          await Student.destroy({
            where: { userId: id },
            transaction,
          });
          break;
        case "admin":
          await Admin.destroy({
            where: { id },
            transaction,
          });
          break;
      }

      // Then delete the user
      await user.destroy({ transaction });

      await transaction.commit();

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Restore a soft-deleted user and their role-specific data (updated with admin)
const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await sequelize.transaction();

    try {
      const user = await User.findOne({
        where: { id },
        paranoid: false,
        transaction,
      });

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: "User not found" });
      }

      // Restore the user first
      await user.restore({ transaction });

      // Restore role-specific record
      switch (user.role) {
        case "teacher":
          await Teacher.restore({
            where: { userId: id },
            transaction,
          });
          break;
        case "parent":
          await Parent.restore({
            where: { userId: id },
            transaction,
          });
          break;
        case "student":
          await Student.restore({
            where: { userId: id },
            transaction,
          });
          break;
        case "admin":
          await Admin.restore({
            where: { id },
            transaction,
          });
          break;
      }

      await transaction.commit();

      res.status(200).json({ message: "User restored successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error rolling back...." });
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error restoring user:", error);
    res.status(500).json({ error: "Failed to restore user" });
  }
};

// User login (unchanged)
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password || email === "" || password === "") {
//       return res.status(400).json({ error: "All fields are required" });
//     }
//     const user = await User.findOne({
//       where: { email },
//       attributes: { exclude: ["deletedAt"] },
//     });

//     if (!user) {
//       return res.status(404).json({ error: "Account not found" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Invalid password" });
//     }

//     const token = generateToken(user);

//     const profilePhotoUrl = user.profilePhoto
//       ? `${req.protocol}://${req.get("host")}${user.profilePhoto}`
//       : null;

//     // Include admin level in response if user is admin
//     const responseData = {
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         sex: user.sex,
//         profilePhoto: profilePhotoUrl,
//       },
//       token,
//     };

//     if (user.role === "admin") {
//       const admin = await Admin.findOne({ where: { userId: user.id } });

//       responseData.user.level = admin.level;
//     }

//     if (user.role === "teacher" && user.teacher) {
//       const teacher = await Teacher.findOne({ where: { userId: user.id } });
//       responseData.user.qualifications = teacher.qualifications;
//       responseData.user.subjects = teacher.subjects;
//     }

//     res.status(200).json(responseData);
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ error: "Failed to log in" });
//   }
// };

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
  loginUser,
  serveProfilePhoto,
  getCurrentUser,
  refreshToken,
  logout,
};
