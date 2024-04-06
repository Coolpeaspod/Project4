const mongoose = require("mongoose");
const { Timestamp } = require("bson");
const { title } = require("process");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    topic: {
      type: String,
      required: [true, "Topic is required"],
      enum: ["Education", "Fun", "Other", "Free Stuff", "Expos"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [10, "the content should have at least 10 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    image: {
      type: String,
      data: Buffer,
      required: [true, "Image is required"],
    },
    // createdAt: {
    //   type: Date,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
