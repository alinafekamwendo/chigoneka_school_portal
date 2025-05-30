const { User, Teacher, Parent, Student, Admin } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Joi = require("joi");
const { sequelize } = require("../models");
const cookie = require("cookie");

// Token generation functions (unchanged)
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Refresh token endpoint (unchanged)
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token required",
        shouldLogout: true,
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: ["id", "role"],
    });

    if (!user) {
      res.clearCookie("refreshToken");
      return res.status(403).json({
        error: "Invalid refresh token",
        shouldLogout: true,
      });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token: newAccessToken,
      expiresIn: 15 * 60 * 1000,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
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

// Updated login function to include role numbers
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["deletedAt"] },
      include: [
        {
          model: Teacher,
          as: "teacher",
          required: false,
          attributes: ["staffNumber", "qualifications", "subjects"],
        },
        {
          model: Parent,
          as: "parent",
          required: false,
          attributes: ["parentNumber"],
        },
        {
          model: Student,
          as: "student",
          required: false,
          attributes: ["studentNumber"],
        },
        {
          model: Admin,
          as: "admin",
          required: false,
          attributes: ["adminNumber", "level"],
        },
      ],
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

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      })
    );

    const profilePhotoUrl = user.profilePhoto
      ? `${req.protocol}://${req.get("host")}${user.profilePhoto}`
      : null;

    // Build response with role-specific number
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

    // Add role-specific number to response
    switch (user.role) {
      case "teacher":
        responseData.user.staffNumber = user.teacher?.staffNumber;
        responseData.user.qualifications = user.teacher?.qualifications;
        responseData.user.subjects = user.teacher?.subjects;
        break;
      case "parent":
        responseData.user.parentNumber = user.parent?.parentNumber;
        break;
      case "student":
        responseData.user.studentNumber = user.student?.studentNumber;
        break;
      case "admin":
        responseData.user.adminNumber = user.admin?.adminNumber;
        responseData.user.level = user.admin?.level;
        break;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
};

// Logout function (unchanged)
const logout = async (req, res) => {
  try {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      })
    );
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Failed to logout" });
  }
};

// Multer configuration (unchanged)
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

// Token generation (unchanged)
const generateToken = (user) => {
  return jwt.sign(
    { username: user.username, id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "4h" }
  );
};

// Validation schemas (unchanged)
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

// Updated createUser function to handle shared IDs
const createUser = async (req, res) => {
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
        level,
      } = req.body;

      // Validate input data (unchanged)
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

      let roleValidationError;
      switch (role.toLowerCase()) {
        case "teacher":
          roleValidationError = teacherSchema.validate({
            qualifications,
            subjects,
          }).error;
          break;
        case "student":
          roleValidationError = studentSchema.validate({ parentId }).error;
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

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }, { phone }],
        },
      });

      if (existingUser) {
        const errors = [];
        if (existingUser.username === username)
          errors.push("Username already exists");
        if (existingUser.email === email) errors.push("Email already exists");
        if (existingUser.phone === phone)
          errors.push("Phone number already exists");
        return res.status(400).json({ errors });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const lowerCaseRole = role.toLowerCase();
      const upperCaseSex = sex.toUpperCase();

      let profilePhotoUrl = null;
      if (req.file) {
        profilePhotoUrl = `/uploads/profilephotos/${req.file.filename}`;
      }

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

        // Create role-specific record with same ID
        switch (lowerCaseRole) {
          case "teacher":
            await Teacher.create(
              {
                id: user.id, // Using same ID as user
                qualifications: qualifications || [],
                subjects: subjects || [],
              },
              { transaction }
            );
            break;
          case "parent":
            await Parent.create(
              {
                id: user.id, // Using same ID as user
              },
              { transaction }
            );
            break;
          case "student":
            const parent = await Parent.findByPk(parentId, { transaction });
            if (!parent) {
              await transaction.rollback();
              return res.status(400).json({ error: "Parent not found" });
            }
            await Student.create(
              {
                id: user.id, // Using same ID as user
                parentId,
                alte_guardian_Id: alte_guardian_Id || null,
              },
              { transaction }
            );
            break;
          case "admin":
            await Admin.create(
              {
                id: user.id, // Using same ID as user
                level: level || "regular",
              },
              { transaction }
            );
            break;
        }

        await transaction.commit();

        // Fetch the newly created user with role data
        const newUser = await User.findByPk(user.id, {
          attributes: { exclude: ["password"] },
          include: [
            {
              model: Teacher,
              as: "teacher",
              required: false,
              attributes: ["staffNumber"],
            },
            {
              model: Parent,
              as: "parent",
              required: false,
              attributes: ["parentNumber"],
            },
            {
              model: Student,
              as: "student",
              required: false,
              attributes: ["studentNumber"],
            },
            {
              model: Admin,
              as: "admin",
              required: false,
              attributes: ["adminNumber", "level"],
            },
          ],
        });

        const token = generateToken(user);

        // Add role number to response
        const responseData = {
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            profilePhoto: newUser.profilePhoto,
          },
          token,
        };

        switch (newUser.role) {
          case "teacher":
            responseData.user.staffNumber = newUser.teacher?.staffNumber;
            break;
          case "parent":
            responseData.user.parentNumber = newUser.parent?.parentNumber;
            break;
          case "student":
            responseData.user.studentNumber = newUser.student?.studentNumber;
            break;
          case "admin":
            responseData.user.adminNumber = newUser.admin?.adminNumber;
            responseData.user.level = newUser.admin?.level;
            break;
        }

        res.status(200).json(responseData);
      } catch (error) {
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

// Updated getCurrentUser to include role numbers
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const include = [];
    switch (user.role) {
      case "teacher":
        include.push({
          model: Teacher,
          as: "teacher",
          attributes: ["staffNumber", "qualifications", "subjects"],
        });
        break;
      case "parent":
        include.push({
          model: Parent,
          as: "parent",
          attributes: ["parentNumber"],
        });
        break;
      case "student":
        include.push({
          model: Student,
          as: "student",
          attributes: ["studentNumber"],
          include: [
            {
              model: Parent,
              as: "parent",
              attributes: ["parentNumber"],
            },
          ],
        });
        break;
      case "admin":
        include.push({
          model: Admin,
          as: "admin",
          attributes: ["adminNumber", "level"],
        });
        break;
    }

    const fullUser = await User.findOne({
      where: { id: user.id },
      attributes: { exclude: ["password", "deletedAt"] },
      include: include.length ? include : undefined,
    });

    if (!fullUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add profile photo URL if exists
    if (fullUser.profilePhoto) {
      fullUser.profilePhoto = `${req.protocol}://${req.get("host")}${
        fullUser.profilePhoto
      }`;
    }

    res.status(200).json(fullUser);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Failed to fetch current user" });
  }
};

// Updated getUserById to include role numbers
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
          attributes: ["staffNumber", "qualifications", "subjects"],
        },
        {
          model: Parent,
          as: "parent",
          required: false,
          attributes: ["parentNumber"],
        },
        {
          model: Student,
          as: "student",
          required: false,
          attributes: ["studentNumber"],
          include: [
            {
              model: Parent,
              as: "parent",
              attributes: ["parentNumber"],
            },
          ],
        },
        {
          model: Admin,
          as: "admin",
          required: false,
          attributes: ["adminNumber", "level"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add profile photo URL if exists
    if (user.profilePhoto) {
      user.profilePhoto = `${req.protocol}://${req.get("host")}${
        user.profilePhoto
      }`;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Updated updateUser function
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
        level,
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
                  where: { id }, // Now using id directly instead of userId
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
                  where: { id }, // Now using id directly
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
                  where: { id }, // Now using id directly
                  transaction,
                }
              );
            }
            break;
        }

        await transaction.commit();

        // Fetch updated user with role data
        const updatedUser = await User.findByPk(id, {
          attributes: { exclude: ["password", "deletedAt"] },
          include: [
            {
              model: Teacher,
              as: "teacher",
              required: false,
              attributes: ["staffNumber"],
            },
            {
              model: Parent,
              as: "parent",
              required: false,
              attributes: ["parentNumber"],
            },
            {
              model: Student,
              as: "student",
              required: false,
              attributes: ["studentNumber"],
            },
            {
              model: Admin,
              as: "admin",
              required: false,
              attributes: ["adminNumber", "level"],
            },
          ],
        });

        // Add profile photo URL if exists
        if (updatedUser.profilePhoto) {
          updatedUser.profilePhoto = `${req.protocol}://${req.get("host")}${
            updatedUser.profilePhoto
          }`;
        }

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

// Updated deleteUser function
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
            where: { id }, // Now using id directly
            transaction,
          });
          break;
        case "parent":
          await Parent.destroy({
            where: { id }, // Now using id directly
            transaction,
          });
          break;
        case "student":
          await Student.destroy({
            where: { id }, // Now using id directly
            transaction,
          });
          break;
        case "admin":
          await Admin.destroy({
            where: { id }, // Now using id directly
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

// Updated restoreUser function
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
            where: { id }, // Now using id directly
            transaction,
          });
          break;
        case "parent":
          await Parent.restore({
            where: { id }, // Now using id directly
            transaction,
          });
          break;
        case "student":
          await Student.restore({
            where: { id }, // Now using id directly
            transaction,
          });
          break;
        case "admin":
          await Admin.restore({
            where: { id }, // Now using id directly
            transaction,
          });
          break;
      }

      await transaction.commit();
      res.status(200).json({ message: "User restored successfully" });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error restoring user:", error);
    res.status(500).json({ error: "Failed to restore user" });
  }
};

// getAllUsers remains unchanged as it doesn't need role-specific numbers
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
