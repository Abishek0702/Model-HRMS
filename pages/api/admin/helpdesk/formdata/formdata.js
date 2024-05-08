import { apiHandler } from "helpers/api";
import { fetchFormdata } from "../../../../../services/apiservices/api.service";

export default apiHandler({
    get: getformdata,
});

async function getformdata(req, res) {

    // Check if Admin
   // if (req.user.designation !== "admin") { res.status(200).json({ message: "user Access Denied", status: 0 }) }
    const fetchAsynData = async () => {

        var hd_types = await fetchFormdata('SELECT helpdesk_types.id as value , helpdesk_types.name as label from helpdesk_types WHERE status=1')
        
        var hd_status = await fetchFormdata(`SELECT helpdesk_status.id as value , helpdesk_status.name as label from helpdesk_status WHERE status=1`)

        var designations = await fetchFormdata(`SELECT users.id,users.name,users.designation_id,designations.designationName FROM users LEFT JOIN designations ON designations.id = users.designation_id WHERE users.department_id <=4 AND users.status=1 ORDER BY id `)
        try {
            const [helpdesk_types, helpdesk_status, designation_id] = await Promise.all([hd_types, hd_status, designations]);
            
            res.status(200).json({ helpdesk_types, helpdesk_status, designation_id });
        } catch (error) {
            console.log("errror", error);
            res.status(500).json({ error: "internal Server Error" });
        }
    };

    fetchAsynData();
}
