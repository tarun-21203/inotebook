const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all the Notes using GET "/api/notes/fetchallnotes". Login required.
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

})



// ROUTE 2: Add a new Note using POST "/api/notes/addnote". Login required.
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 })

], async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        // If there are errors then return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

})



// ROUTE 3: Update an existing Note using PUT "/api/notes/updatenote/:id". Login required.
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //  Create new note object
        const newnote = {};
        if (title) {
            newnote.title = title;
        }
        if (description) {
            newnote.description = description;
        }
        if (tag) {
            newnote.tag = tag;
        }

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Allow updation only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });
        res.send({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

})



// ROUTE 4: Delete an existing Note using DELETE "/api/notes/deletenote/:id". Login required.
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        // Find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.send({ "Success": "NOte has been deleted", note: note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

})


module.exports = router;