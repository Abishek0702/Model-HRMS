const bcrypt = require("bcryptjs");
const moment = require("moment");
import { apiHandler } from "helpers/api";
// import { leaveapplicationMail } from "helpers/api";

const connection = require("helpers/api/routes/pool.js");

export default apiHandler({
  post: request,
});

async function request(req, res) {
  try {
    const currentTime = moment().utc().format("YYYY-MM-DD HH:mm");

    const { ...users } = req.body;
    let {
      user_id,
      leavetype_id,
      start_date,
      end_date,
      half_day,
      Reason,
      leavestatus_id,
      approveruser_id,
      approverReason,
    } = users;

    // Set default values if not provided
    leavetype_id = leavetype_id || "";
    start_date = start_date || "";
    end_date = end_date || "";
    half_day = half_day || "";
    Reason = Reason || "";
    leavestatus_id = leavestatus_id || "3";
    approveruser_id = approveruser_id || 0;
    approverReason = approverReason || "";

    // Format start and end dates
    const start_date_formatted = moment(start_date, "YYYY-MM-DD").format("YYYY-MM-DD");
    const end_date_formatted = half_day === "true" ? start_date_formatted : moment(end_date, "YYYY-MM-DD").format("YYYY-MM-DD");

    const startMoment = moment(start_date_formatted, "YYYY-MM-DD");
    const endMoment = moment(end_date_formatted, "YYYY-MM-DD");

    // Calculate the number of days
    const num_days = half_day == 1
      ? 0.5
      : endMoment.diff(startMoment, "days") + 1;
    console.log("Number of days:", num_days);

    const query = `INSERT INTO leavemanagements (id, user_id, leavetype_id, start_date, end_date, half_day, Reason, leavestatus_id, approveruser_id, numberOfDays, approverReason, created_at, updated_at,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const data = [
      null,
      user_id,
      leavetype_id,
      start_date_formatted,
      end_date_formatted,
      half_day,
      Reason,
      leavestatus_id,
      approveruser_id,
      num_days,
      approverReason,
      currentTime,
      currentTime,
      1
    ];

    connection.query(query, data, async (err, results, fields) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      } else {
        const getQuery = "SELECT * FROM users WHERE id = ?";
        connection.query(getQuery, [user_id], (err2, userResults) => {
          if (err2) {
            console.error("Error executing query:", err2);
            return res.status(500).json({ message: "Internal Server Error" });
          } else {
            if (userResults.length === 0) {
              return res.status(200).json({ message: "User not found" });
            }

            const userData = userResults[0];

            // leaveapplicationMail(user_id, userData.name, Reason);
            res.status(200).json({ data: "Form submitted", status: 1 });
          }
        });
      }
    });

    if (!user_id) {
      res.status(200).json({ data: "Please provide the user_id", status: 0 });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

