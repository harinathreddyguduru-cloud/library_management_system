const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/dashboard", async (req, res) => {
  try {
    const totalBooks = await pool.query(
      "SELECT COUNT(*) FROM books"
    );

    const availableBooks = await pool.query(
      "SELECT COALESCE(SUM(available_count),0) FROM books"
    );

    const issuedBooks = await pool.query(
      "SELECT COUNT(*) FROM issue_records WHERE status = 'Issued'"
    );

    const totalStudents = await pool.query(
      "SELECT COUNT(*) FROM students"
    );

    const borrowRequests = await pool.query(
      "SELECT COUNT(*) FROM issue_records WHERE status = 'Requested'"
    );

    const returnRequests = await pool.query(
      "SELECT COUNT(*) FROM issue_records WHERE status = 'Return Requested'"
    );

    res.json({
      totalBooks: parseInt(totalBooks.rows[0].count),
      availableBooks: parseInt(
        availableBooks.rows[0].coalesce
      ),
      issuedBooks: parseInt(
        issuedBooks.rows[0].count
      ),
      borrowRequests: parseInt(borrowRequests.rows[0].count),
      returnRequests: parseInt(returnRequests.rows[0].count),
      totalStudents: parseInt(
        totalStudents.rows[0].count
      ),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Dashboard data fetch failed",
    });
  }
});
router.get("/overdue-books", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ir.id,
        b.title,
        s.roll_number,
        u.name,
        ir.issue_date,
        ir.due_date,
        CEIL(EXTRACT(epoch FROM (NOW() - (ir.due_date AT TIME ZONE 'Asia/Calcutta'))) / 86400)::int AS overdue_days,
        CASE
          WHEN LOWER(ir.status) = 'issued' AND (ir.due_date AT TIME ZONE 'Asia/Calcutta') < NOW()
            THEN CEIL(EXTRACT(epoch FROM (NOW() - (ir.due_date AT TIME ZONE 'Asia/Calcutta'))) / 86400)::int * 5
          ELSE COALESCE(ir.fine_amount, 0)
        END AS fine_amount
      FROM issue_records ir
      JOIN books b
        ON ir.book_id = b.id
      JOIN students s
        ON ir.student_id = s.id
      JOIN users u
        ON s.user_id = u.id
      WHERE LOWER(ir.status) = 'issued'
      AND (ir.due_date AT TIME ZONE 'Asia/Calcutta') < NOW()
      ORDER BY ir.due_date ASC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch overdue books"
    });
  }
});
module.exports = router;