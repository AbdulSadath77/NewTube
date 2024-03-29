import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
    },
    password: {
      type: String,
      requried: [true, "Password is requierd"],
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
      //   required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // if the password is not modified! directly goto next middleware
  if (!this.isModified("password")) return next();

  // encrypt the password with the hash code using the bcrypt package
  // this.password = await bcrypt.hash(this.password, 10); // normally await has no effect on it
  this.password = await new Promise((resolve, reject) => {
    bcrypt.hash(this.password, 10, (err, hashNow) => {
      if (err) reject(err);
      resolve(hashNow);
    });
  });
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
      email: this.email,
      password: this.password,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
