const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET all books
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM books ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching books",
    });
  }
});

// ADD BOOK
router.post("/", async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      publisher,
      category_id,
      total_count,
      available_count,
      shelf_location,
      description,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO books
      (title, author, isbn, publisher, category_id,
       total_count, available_count, shelf_location, description)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        title,
        author,
        isbn,
        publisher,
        category_id,
        total_count,
        available_count,
        shelf_location,
        description,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error adding book",
    });
  }
});

// UPDATE BOOK
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      isbn,
      publisher,
      category_id,
      total_count,
      available_count,
      shelf_location,
      description,
    } = req.body;

    const result = await pool.query(
      `UPDATE books SET
        title = $1,
        author = $2,
        isbn = $3,
        publisher = $4,
        category_id = $5,
        total_count = $6,
        available_count = $7,
        shelf_location = $8,
        description = $9
      WHERE id = $10
      RETURNING *`,
      [
        title,
        author,
        isbn,
        publisher,
        category_id,
        total_count,
        available_count,
        shelf_location,
        description,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating book" });
  }
});

// DELETE BOOK
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting book" });
  }
});

module.exports = router;
