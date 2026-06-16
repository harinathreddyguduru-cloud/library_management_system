const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET all books
router.get("/", async (req, res) => {
  try {
    const { search = "", genre = "", page = 1, limit = 100 } = req.query;
    const values = [];
    let whereClauses = [];

    if (search) {
      values.push(`%${search.trim()}%`);
      values.push(`%${search.trim()}%`);
      values.push(`%${search.trim()}%`);
      whereClauses.push(`(b.title ILIKE $${values.length - 2} OR b.author ILIKE $${values.length - 1} OR b.isbn ILIKE $${values.length})`);
    }

    if (genre) {
      values.push(genre.trim());
      whereClauses.push(`c.name ILIKE $${values.length}`);
    }

    let query = `SELECT
         b.*,
         c.name AS category_name
       FROM books b
       LEFT JOIN categories c ON b.category_id = c.id`;

    const countQuery = query + (whereClauses.length ? ` WHERE ${whereClauses.join(" AND ")}` : "");
    const countResult = await pool.query(countQuery.replace(/SELECT[\s\S]*?FROM books b/iu, "SELECT COUNT(*) AS total FROM books b"), values);

    if (whereClauses.length) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    query += ` ORDER BY b.id LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(parseInt(limit, 10));
    values.push((Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10));

    const result = await pool.query(query, values);

    res.json({ rows: result.rows, total: parseInt(countResult.rows[0].total, 10) });
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
