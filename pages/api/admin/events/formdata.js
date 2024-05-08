import { apiHandler } from "helpers/api";
const connection = require('helpers/api/routes/pool.js');

export default apiHandler({ get: getformdata });

async function getformdata(req, res) {
    // if (req.user.designation !== "admin") { res.status(200).json({ message: "user Access Denied", status: 0 }) }
    const fetchAsynData = async () => {
        var event_type = fetchFormdata(`SELECT id, type_of_event from event_types WHERE status=1;`)
        try { 
            const [event] = await Promise.all([event_type]); 
            return res.status(200).json({ event }); 
        }
        catch (error) { res.status(500).json({ error: "internal Server Error" }); }
    };
    fetchAsynData();
}

const fetchFormdata = async (q) => {
    return new Promise((resolve, reject) => {
        connection.query(q, (err, result) => {
            if (err) { console.log("ERR..", err); resolve([]) }
            else { resolve(result); }
        });
    });
}