import { apiHandler } from "helpers/api";
import { getHolidays, getBirthdays, getEvents, getEmpofmonth, getConfirmedEmps, getEmployeeCount } from "../../../../services/apiservices/dashboard.services";

export default apiHandler({
    get: dashboard
});

// dashboard function
async function dashboard(req, res) {
    try {
        const search = req.query.search || "";
        const event = req.query.event || "";
        const title = req.query.title || "";
        const startDate = moment.utc().utcOffset('+05:30').format('MM-DD');
        const endDate = moment().add(30, 'day').format('MM-DD');
        const [
            empofmonth,
            holiday,
            birthday,
            events,
        ] = await Promise.all([
            getEmpofmonth(req, search),
            getHolidays(req, search),
            getBirthdays(req, search, startDate, endDate),
            getEvents(req, event, title),
        ]);

        return res.status(200).json({
            empofmonth,
            holiday,
            birthday,
            events,
        });

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

