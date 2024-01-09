const express = require('express');
const router = express.Router({ mergeParams: true });
const { fetchJokes, createJoke, updateJoke, deleteJoke } = require('../handlers/jokes');

router.route("/fetch").get(fetchJokes);
router.route("/create").post(createJoke);
router.route("/:joke_id/update").put(updateJoke);
router.route("/:joke_id/delete").put(deleteJoke);

module.exports = router;
