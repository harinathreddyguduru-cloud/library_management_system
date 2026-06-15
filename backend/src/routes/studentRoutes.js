const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Student list for admin
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const values = [];
    let query = `
      SELECT
        u.id AS user_id,
        u.name,
        u.email,
        s.id AS student_id,
        s.roll_number,
        s.department,
        s.semester,
        s.phone
      FROM students s
      JOIN users u ON s.user_id = u.id
    `;

    if (search) {
      query += ` WHERE LOWER(u.name) LIKE LOWER($1) OR LOWER(s.roll_number) LIKE LOWER($1)`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY u.name ASC`;

    const result = await pool.query(query, values);
    res.json(result.rows.map((row) => ({
      _id: row.student_id,
      name: row.name,
      email: row.email,
      studentId: row.roll_number,
      department: row.department,
      semester: row.semester,
      phone: row.phone,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// Student Borrow History
router.get("/:id/history", async (req, res) => {
  try {
    const studentId = req.params.id;

    const result = await pool.query(
      `
      SELECT
        ir.id,
        b.title,
        ir.issue_date,
        ir.due_date,
        ir.return_date,
        ir.status,
        ir.fine_amount
      FROM issue_records ir
      JOIN books b
        ON ir.book_id = b.id
      WHERE ir.student_id = $1
      ORDER BY ir.issue_date DESC
      `,
      [studentId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch history"
    });
  }
});

module.exports = router;