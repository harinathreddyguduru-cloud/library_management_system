const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;
    const conditions = [];
    const values = [];
    const overdueStatusFilter = status && status.toLowerCase() === "overdue";

    let query = `
      SELECT
        ir.id,
        ir.issue_date,
        ir.due_date,
        ir.return_date,
        CASE
          WHEN LOWER(ir.status) = 'issued' AND (ir.due_date AT TIME ZONE 'Asia/Calcutta') < NOW()
            THEN 'Overdue'
          ELSE ir.status
        END AS status,
        CASE
          WHEN LOWER(ir.status) = 'issued' AND (ir.due_date AT TIME ZONE 'Asia/Calcutta') < NOW()
            THEN CEIL(EXTRACT(epoch FROM (NOW() - (ir.due_date AT TIME ZONE 'Asia/Calcutta'))) / 86400)::int
          ELSE 0
        END AS overdue_days,
        CASE
          WHEN LOWER(ir.status) = 'issued' AND (ir.due_date AT TIME ZONE 'Asia/Calcutta') < NOW()
            THEN CEIL(EXTRACT(epoch FROM (NOW() - (ir.due_date AT TIME ZONE 'Asia/Calcutta'))) / 86400)::int * 5
          ELSE COALESCE(ir.fine_amount, 0)
        END AS fine_amount,
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
      if (overdueStatusFilter) {
        conditions.push("LOWER(ir.status) = 'issued' AND (ir.due_date AT TIME ZONE 'Asia/Calcutta') < NOW()");
      } else {
        conditions.push("LOWER(ir.status) = LOWER($" + (values.length + 1) + ")");
        values.push(status);
      }
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

    const existingRequest = await pool.query(
      `SELECT * FROM issue_records
       WHERE book_id = $1
         AND student_id = $2
         AND status IN ('Requested', 'Issued', 'Return Requested')`,
      [book_id, student_id]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({
        message: "You already have a pending request or an active borrow for this book."
      });
    }

    const requestDate = new Date();

    await pool.query(
      `INSERT INTO issue_records
      (book_id, student_id, issue_date, due_date, status)
      VALUES ($1,$2,$3,$4,$5)`,
      [
        book_id,
        student_id,
        requestDate,
        null,
        "Requested"
      ]
    );

    res.status(201).json({
      message: "Borrow request submitted. Admin approval is required."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Issue request failed"
    });
  }
});

router.post("/approve", async (req, res) => {
  try {
    const { issue_id } = req.body;

    const issueResult = await pool.query(
      "SELECT * FROM issue_records WHERE id = $1",
      [issue_id]
    );

    if (issueResult.rows.length === 0) {
      return res.status(404).json({
        message: "Issue request not found"
      });
    }

    const issue = issueResult.rows[0];

    if (issue.status !== "Requested") {
      return res.status(400).json({
        message: "Only requested borrow records can be approved."
      });
    }

    const bookResult = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [issue.book_id]
    );

    const book = bookResult.rows[0];

    if (!book || book.available_count <= 0) {
      return res.status(400).json({
        message: "Book is no longer available to issue."
      });
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setTime(dueDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days due duration

    await pool.query(
      `UPDATE issue_records
       SET issue_date = $1,
           due_date = $2,
           status = $3
       WHERE id = $4`,
      [issueDate, dueDate, "Issued", issue_id]
    );

    await pool.query(
      `UPDATE books
       SET available_count = available_count - 1
       WHERE id = $1`,
      [issue.book_id]
    );

    res.json({
      message: "Borrow request approved.",
      issue_id,
      due_date: dueDate
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Approval failed"
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

    if (issue.status !== "Issued") {
      return res.status(400).json({
        message: "Only issued books can be requested for return."
      });
    }

    await pool.query(
      `UPDATE issue_records
       SET status = $1
       WHERE id = $2`,
      ["Return Requested", issue_id]
    );

    res.json({
      message: "Return request submitted. Admin approval is required."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Return request failed"
    });
  }
});

router.post("/approve-return", async (req, res) => {
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

    if (issue.status !== "Return Requested") {
      return res.status(400).json({
        message: "Only return requests can be approved."
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
      [returnDate, "Returned", fine, issue_id]
    );

    await pool.query(
      `UPDATE books
       SET available_count = available_count + 1
       WHERE id = $1`,
      [issue.book_id]
    );

    res.json({
      message: "Return request approved and book returned.",
      fine_amount: fine
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Return approval failed"
    });
  }
});

module.exports = router;