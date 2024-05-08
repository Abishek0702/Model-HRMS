import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
export default apiHandler({
    get: getautocomplete
});
function getautocomplete(req, res) {
    var name = req.query.name
    if (typeof name == "undefined") {
        return res.status(200).json({ status: 1, message: "please enter the name" })
    }
    connection.query(`SELECT id ,name,employeeID  FROM users WHERE name LIKE '${name}%' AND status=1`, (err, result) => {
        if (err) { console.log(err); }
        else {
            var data = Object.values(JSON.parse(JSON.stringify(result)))
            return res.status(200).json({ posts: data, });
        }
    })
}