const express = require("express");
const controller = require("../controllers/eventController");
const Event = require("../models/event"); // Import the Event model
const multer = require("multer");
const mongoose = require("mongoose");

const router = express.Router();

// configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// GET /events: send all the events
router.get("/", controller.index);

// GET /events/new
router.get("/new", controller.new);

// POST /events
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const { topic, title, description, location, startTime, endTime } =
      req.body;
    const image = req.file ? "/uploads/" + req.file.filename : "";

    // Create a new event instance
    const newEvent = new Event({
      topic,
      title,
      description,
      location,
      startTime,
      endTime,
      image,
    });

    // Save the new event
    await newEvent.save();

    // Redirect to the event show page or any other desired page
    res.redirect(`/events/${newEvent._id}`);
  } catch (err) {
    next(err);
  }
});

// GET /events/:id
router.get("/:id", controller.show);

// GET /events/:id/edit
router.get("/:id/edit", controller.edit);

// PUT /events/:id
router.put("/:id", upload.single("image"), async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const { topic, title, description, location, startTime, endTime } =
      req.body;
    const image = req.file ? "/uploads/" + req.file.filename : "";


    // Find the event by ID and update it
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        topic,
        title,
        description,
        location,
        startTime,
        endTime,
        // image,
      },
      { new: true }
    ); // Set { new: true } to return the updated document

    if (!updatedEvent) {
      let err = Error("Cannot update event with id " + eventId);
      err.status = 400;
      throw err;
    }

    // Redirect to the updated event show page or any other desired page
    res.redirect(`/events/${eventId}`);
  } catch (err) {
    next(err);
  }
});

// DELETE /events/:id
router.delete("/:id", controller.delete);

module.exports = router;
