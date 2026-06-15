const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;
    const conditions = [];
    const values = [];

    let query = `
      SELECT
        ir.id,
        ir.issue_date,
        ir.due_date,
        ir.return_date,
        ir.status,
        ir.fine_amount,
        b.title AS book_title,
        b.author AS book_author,
        s.roll_number,
        u.name AS student_name,
        s.id AS student_id
      FROM issue_records ir
      JOIN books b ON ir.book_id = b.id
      JOIN students s ON ir.student_id = s.id
      JOIN users u ON s.user_id = u.id
    `;

    if (status) {
      conditions.push("LOWER(ir.status) = LOWER($" + (values.length + 1) + ")");
      values.push(status);
    }

    if (search) {
      conditions.push(
        `(LOWER(b.title) LIKE LOWER($${values.length + 1}) OR LOWER(u.name) LIKE LOWER($${values.length + 1}) OR LOWER(s.roll_number) LIKE LOWER($${values.length + 1}))`
      );
      values.push(`%${search}%`);
    }

    if (conditions.length) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY ir.issue_date DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch borrow records" });
  }
});

router.post("/issue", async (req, res) => {
  try {
    const { book_id, student_id } = req.body;

    // Check book availability
    const bookResult = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [book_id]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    const book = bookResult.rows[0];

    if (book.available_count <= 0) {
      return res.status(400).json({
        message: "Book not available"
      });
    }

    // Issue date
    const issueDate = new Date();

    // Due date = 14 days later
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create issue record
    await pool.query(
      `INSERT INTO issue_records
      (book_id, student_id, issue_date, due_date, status)
      VALUES ($1,$2,$3,$4,$5)`,
      [
        book_id,
        student_id,
        issueDate,
        dueDate,
        "Issued"
      ]
    );

    // Reduce availability
    await pool.query(
      `UPDATE books
       SET available_count = available_count - 1
       WHERE id = $1`,
      [book_id]
    );

    res.status(201).json({
      message: "Book issued successfully",
      due_date: dueDate
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Issue failed"
    });
  }
});
router.post("/return", async (req, res) => {
  try {
    const { issue_id } = req.body;

    const issueResult = await pool.query(
      "SELECT * FROM issue_records WHERE id = $1",
      [issue_id]
    );

    if (issueResult.rows.length === 0) {
      return res.status(404).json({
        message: "Issue record not found"
      });
    }

    const issue = issueResult.rows[0];

    if (issue.status === "Returned") {
      return res.status(400).json({
        message: "Book already returned"
      });
    }

    const returnDate = new Date();

    let fine = 0;

    if (returnDate > issue.due_date) {
      const overdueDays = Math.ceil(
        (returnDate - new Date(issue.due_date)) /
        (1000 * 60 * 60 * 24)
      );

      fine = overdueDays * 5;
    }

    await pool.query(
      `UPDATE issue_records
       SET return_date = $1,
           status = $2,
           fine_amount = $3
       WHERE id = $4`,
      [
        returnDate,
        "Returned",
        fine,
        issue_id
      ]
    );

    await pool.query(
      `UPDATE books
       SET available_count = available_count + 1
       WHERE id = $1`,
      [issue.book_id]
    );

    res.json({
      message: "Book returned successfully",
      fine_amount: fine
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Return failed"
    });
  }
});
module.exports = router;