//require modules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const eventRoutes = require("./routes/eventRoutes");
const events = require("./models/event");
const path = require("path");

const mongoose = require("mongoose");
const { findById } = require("./models/event");
const uri =
  "mongodb+srv://panelpermit0x:v522C1EzZrg8dups@cluster0.kklwwjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//create app
const app = express();

//configure app
let port = 3000;
let host = "localhost";
app.set("view engine", "ejs");

//mount middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));

app.set("views", path.join(__dirname, "views"));

//connect to database
mongoose
  .connect(uri)
  .then(() => {
    app.listen(port, host, () => {
      console.log("Server is running on port, ", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });

//set up routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/events", eventRoutes);

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/events/:id", (req, res) => {
  let event = events.findById(req.params.id);

  // Log the image path
  console.log("Image Path:", event.image);

  // Format times in 12-hour format if needed

  res.render("event/show", {
    event,
  });
});

app.get("/events/:id/edit", (req, res) => {
  let id = req.params.id;
  res.render("edit", { id });
});

app.get("/events/new", (req, res) => {
  const newEvent = createNewEvent(); // Make sure createNewEvent is defined
  console.log("New Event:", newEvent);

  res.render("event/new", { event: newEvent });
});

app.use((req, res, next) => {
  let err = new Error('The server cannot locate ' + req.url);
  err.status = 404;
  next(err);

});

app.use((err, req, res, next) => {
  if (!err.status) {
    console.log(err.stack);
    err.status = 500;
    err.message = "Internal server error";
  }
  res.status(err.status);
  res.render("error", { error: err });
});

app.get("/events/:id/edit", (req, res) => {
  let id = req.params.id;
  let event = events.findById(id);
  res.render("edit", { id, event });
});

//start the server
