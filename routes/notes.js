const notesRouter = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("util");
const readFromFile = util.promisify(fs.readFile);

// GET Route for retrieving notes
notesRouter.get("/", (req, res) => {
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((notes) => {
      res.json(notes);
    });
});

// POST Route for a new note
notesRouter.post("/", (req, res) => {
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((notes) => {
      const allNotes = notes;
      const newNote = req.body;
      newNote.id = uuidv4();
      allNotes.push(newNote);
      // Save that array to the filesystem
      fs.writeFile("./db/db.json", JSON.stringify(allNotes), (err, data) => {
        if (err) throw err;
        // Respond to the POST request
        res.json({ msg: "Note added successfully" });
      });
    });
});

// DELETE Route for a specific note
notesRouter.delete("/:id", (req, res) => {
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((notes) => {
      const result = notes.filter(
        (deleteNote) => deleteNote.id !== req.params.id
      );
      // Save that array to the filesystem
      fs.writeFile("./db/db.json", JSON.stringify(result), (err, data) => {
        if (err) throw err;
        // Respond to the DELETE request
        res.json({ msg: "Note deleted successfully" });
      });
    });
});

module.exports = notesRouter;
