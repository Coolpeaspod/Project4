const model = require("../models/event");
const luxon = require('luxon');

//GET /events: send all the events
exports.index = (req, res, next) => {
  model
    .find()
    //.lean() // simplfies the id as well, so it returns int which is not what we need
    .then((events) => {
      res.render("./event/index", { events });
      //console.log(events);
    })
    .catch((err) => {
      next(err);
    });
};

// GET /events/new
exports.new = (req, res) => {
  // res.send('send the new form');
  res.render("./event/new");
};

//POST /events
exports.create = (req, res, next) => {
  let event = new model(req.body);
  event
    .save(event)
    .then((event) => {
      console.log(event);
      res.redirect("/events");
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

//GET /events/:id
exports.show = (req, res, next) => {
  let id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id");
    err.status = 400;
    return next(err);
  }
  model
    .findById(id)
    //.lean() //doesnt work here either
    .then((event) => {
      if (event) {
        res.render("./event/show", { event });
      } else {
        let err = Error("Cannot find event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      next(err);
    });
};

//GET /events/:id/edit:
exports.edit = (req, res, next) => {
  let id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id");
    err.status = 400;
    return next(err);
  }
  model
    .findById(id)
    .then((event) => {
      if (event) {
        const timeStampStart = event.startTime;
        const timeStampEnd = event.endTime;
        timeStampStart.setHours(timeStampStart.getHours() - 4);
        timeStampEnd.setHours(timeStampEnd.getHours() - 4);
        return res.render("./event/edit", { event });
      } else {
        let err = Error("Cannot find event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      next(err);
    });
};

//PUT /events/:id
exports.update = (req, res, next) => {
  let event = req.body;
  let id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id");
    err.status = 400;
    return next(err);
  }

  model
    .findByIdAndUpdate(id, event, {
      runValidators: true,
      useFindAndModify: false,
    })
    .then((event) => {
      if (event) {
        event.startTime = luxonDateTime;
        res.redirect("/events/" + id);
      } else {
        let err = Error("Cannot find event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

//DELETE /events/:id
exports.delete = (req, res, next) => {
  let id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id");
    err.status = 400;
    return next(err);
  }
  model
    .findByIdAndDelete(id)
    .then((event) => {
      if (event) {
        res.redirect("/events");
      } else {
        let err = Error("Cannot find event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      next(err);
    });
};
