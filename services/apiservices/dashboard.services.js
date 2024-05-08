// Common function
const connection = require("helpers/api/routes/pool.js");
import moment from 'moment';

// Total employee's function
async function getEmployeeCount(req, res) {

    var date = typeof req.query.date !== 'undefined' ? req.query.date : "";

    if (date == "") {
        var q = `SELECT gender, COUNT(*) AS totalcount FROM users GROUP BY gender`;
    }
    else {
        var q = `SELECT gender, COUNT(*) AS usercounts, COUNT(DATE_FORMAT(reports.startTime, '%Y-%m-%d')) AS totalcount 
        FROM users 
        LEFT JOIN reports ON reports.user_id = users.id 
        AND DATE_FORMAT(reports.startTime, '%Y-%m-%d') = '${date}' 
        WHERE users.status = 1 
        GROUP BY gender ORDER BY users.id `;
    }

    const rows = await queryDatabase(q);
    const values = rows.map((row) => row.totalcount || 0);
    const labels = rows.map((row) => row.gender);

    const genderCount = values.reduce((acc, value) => acc + value, 0);

    const pieChartData = {
        values,
        labels,
        genderCount,
        data: 'employee present data',
        type: 'pie',
    };

    return { total_employees: pieChartData };
}

async function getAttendancestatus(req, res) {
    try {
        const date = req.query.date || "";
        const reverseDates = [];
        const currentdate = moment();

        for (let i = 0; i < 5; i++) {
            const reverseDate = moment(currentdate).subtract(i, 'days').format("YYYY-MM-DD");
            reverseDates.push(reverseDate);
        }

        if (date === "") {
            const q1 = ` SELECT COUNT(*) AS totalcount, DATE_FORMAT(users.created_at, '%Y-%m-%d') AS create_date FROM users`;

            const q2 = ` SELECT DATE_FORMAT(startTime, '%Y-%m-%d') AS attendance_date, COUNT(*) AS present_count FROM reports
            WHERE DATE_FORMAT(startTime, '%Y-%m-%d') IN (${reverseDates.map(d => `'${d}'`).join(',')})
            GROUP BY attendance_date`;

            const results1 = await queryDatabase(q1);
            const results2 = await queryDatabase(q2);

            const totalEmployeeCount = results1.reduce((acc, row) => acc + row.totalcount, 0);

            const presentCountMap = results2.reduce((map, row) => {
                map[row.attendance_date] = row.present_count;
                return map;
            }, {});

            const presentcount = reverseDates.map(date => presentCountMap[date] || 0);
            const absentcount = presentcount.map(count => totalEmployeeCount - count);

            const trace1 = {
                x: [...reverseDates],
                y: reverseDates.map(date => totalEmployeeCount),
                name: "total count",
                type: "line"
            };

            const trace2 = {
                x: [...reverseDates],
                y: presentcount,
                name: "present",
                type: "bar"
            };

            const trace3 = {
                x: [...reverseDates],
                y: absentcount,
                name: "absent",
                type: "bar"
            };

            const dataPoints = [trace1, trace2, trace3];

            return { attendance_status: dataPoints };
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error executing query', status: 0 });
    }
}

// confirmed employee's function
async function getConfirmedEmps() {
    const curDate = moment.utc().utcOffset('+05:30').format('YYYY-MM-DD');
    const confmonth = moment().subtract(3, 'months').format('YYYY-MM-DD');
    const q = `SELECT id, name, email, date_of_joining, gender, employeeID FROM users WHERE date_of_joining BETWEEN '${confmonth}' AND '${curDate}' AND status=1 ORDER BY date_of_joining LIMIT 5 `;
    const params = [confmonth, curDate];
    const rows = await queryDatabase(q, params);
    const data = JSON.parse(JSON.stringify(rows));
    for (var i = 0; i < data.length; i++) { data[i].date_of_joining = moment(data[i].date_of_joining).utcOffset('+05:30').format('YYYY-MM-DD'); }
    return { upcoming_confirmation_employees: data };
}

// upcoming_holiday's function
async function getHolidays() {
    const currentdate = moment().utcOffset('+05:30').format('MM-DD');
    let upcomingholiday_Query = `SELECT id, name, DATE_FORMAT(date, '%m-%d') as date, DATE_FORMAT(date, '%m') as month, DAYNAME(date) AS day, YEAR(date) AS year FROM holidays WHERE DATE_FORMAT(date, '%m-%d') > '${currentdate}' AND status=1 ORDER BY date ASC LIMIT 5`;
    const upcomingHolidayRows = await queryDatabase(upcomingholiday_Query);
    const upcoming_holidays = JSON.parse(JSON.stringify(upcomingHolidayRows));
    return { upcoming_holidays };
}

// get today and upcoming birthday's
async function getBirthdays() {
    const curDate = moment.utc().format('MM-DD');
    const curMonth = moment().format('MM');

    const dataQuery = `SELECT u.id, u.name, u.gender, DATE_FORMAT(u.date_of_birth, '%Y-%m-%d') as date_of_birth, DATE_FORMAT(u.date_of_birth, '%m-%d') as date, DATE_FORMAT(u.date_of_birth, '%m') as month FROM users u ORDER BY u.id DESC`;
    const rows = await queryDatabase(dataQuery);
    const data = JSON.parse(JSON.stringify(rows));

    const todays_birthday = [];
    const upcoming_birthdays = [];
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (row.date === curDate) { todays_birthday.push(row); }
        else if ((row.month > curMonth || (row.month === curMonth && row.date >= curDate)) || row.month === '01') {
            upcoming_birthdays.push(row);
        }
    }
    upcoming_birthdays.sort((a, b) => {
        const dateA = moment(a.date_of_birth).format('MM-DD');
        const dateB = moment(b.date_of_birth).format('MM-DD');
        return dateA.localeCompare(dateB);
    });

    const rotatedUpcoming = [];
    if (upcoming_birthdays.length > 0) {
        const startIndex = upcoming_birthdays.findIndex(
            (bday) => moment(bday.date_of_birth).format('MM-DD') >= curDate
        );
        rotatedUpcoming.push(...upcoming_birthdays.slice(startIndex));
        rotatedUpcoming.push(...upcoming_birthdays.slice(0, startIndex));
    }
    return { todays_birthday, upcoming_birthdays: rotatedUpcoming.slice(0, 5) };
}

// get recent events
async function getEvents() {

    let recentevent_Query = `SELECT ge.id, ge.event_type_id, ge.event_date, ge.title, ge.description, ge.path, ge.link, ge.created_at FROM geons_events AS ge LEFT JOIN event_types et ON ge.event_type_id = et.id WHERE ge.status=1 ORDER BY id DESC LIMIT 3`;

    const recentEventRows = await queryDatabase(recentevent_Query);
    const recent_events = JSON.parse(JSON.stringify(recentEventRows));

    for (var i = 0; i < recent_events.length; i++) {
        recent_events[i].event_date = moment(recent_events[i].event_date).format('YYYY-MM-DD');
    }
    return { recent_events };
}

// employee of month function
// employee of month function
async function getEmpofmonth() {

    let dateQuery = `SELECT month from employeeofmonth WHERE status=1 ORDER BY id DESC LIMIT 0,1;`;

    const queryProcess1 = await queryDatabase(dateQuery);
    const results1 = JSON.parse(JSON.stringify(queryProcess1));
    if (typeof results1[0].month !== "undefined") {
    const month = moment(results1[0].month).utcOffset('+05:30').format('YYYY-MM');

    const dataQuery = `SELECT u.id as user_id, u.name, u.gender, u.role, e.month, DATE_FORMAT(e.month, '%m') AS display_month FROM employeeofmonth AS e LEFT JOIN users AS u ON e.user_id = u.id WHERE DATE_FORMAT(e.month, '%Y-%m') = '${month}' AND e.status = 1`;
    const queryProcess2 = await queryDatabase(dataQuery);
    var results2 = JSON.parse(JSON.stringify(queryProcess2));
    }else{
        var results2 = [];   
    }
    

    return { empofmonth : results2} 
}

// Common Function
function queryDatabase(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, rows, fields) {
            if (err) {
                console.log("Error in data query: ", err);
                resolve([])
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    getEmployeeCount,
    getAttendancestatus,
    getConfirmedEmps,
    getHolidays,
    getBirthdays,
    getEvents,
    getEmpofmonth,
    queryDatabase
};