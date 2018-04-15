var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var idea = require("../models/Idea");
var methodOverride = require("method-override");

// load helpers auth
const { ensureAuthentificated } = require("../helpers/auth");

/* GET ideas listing. */
router.get("/", ensureAuthentificated, function(req, res, next) {
  idea
    .find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

/* Add an Idea FORM  */
router.get("/add", ensureAuthentificated, (req, res) => {
  res.render("ideas/add");
});

// Edit Page
router.get("/edit/:id", ensureAuthentificated, (req, res) => {
  idea
    .findOne({
      _id: req.params.id
    })
    .then(idea => {
      res.render("ideas/edit", {
        idea: idea
      });
    });
});

// validation & add idea
router.post("/", ensureAuthentificated, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  // if (!req.body.details) {
  //   errors.push({ text: "Please add some details" });
  // }
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    {
      const newUser = {
        title: req.body.title,
        details: req.body.details
      };
      new idea(newUser).save().then(idea => {
        req.flash("success_msg", "Video Idea added");
        res.redirect("/ideas");
      });
    }
  }
});

// EDIT PUT idea
router.put("/:id", ensureAuthentificated, (req, res) => {
  idea
    .findOne({
      _id: req.params.id
    })
    .then(idea => {
      // new values
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save().then(idea => {
        req.flash("success_msg", "Video Idea updated");
        res.redirect("/ideas");
      });
    });
});

// DELETE
router.delete("/:id", ensureAuthentificated, (req, res) => {
  idea.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Video Idea removed");
    res.redirect("/ideas");
  });
});

module.exports = router;
