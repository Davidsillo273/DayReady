import mongoose, { Schema, model } from "mongoose";

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    carnet: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    addresses: [
      {
        label: { type: String, trim: true },
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    favorites: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    loginAttempts: {
      type: Number,
      default: 0,
    },
    timeOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Customers", customerSchema);