import { apiHandler } from "helpers/api";

const connection = require('helpers/api/routes/pool.js')

export default apiHandler({
    get: getData
})

function getData(req, res) {

    const fetchAsyncData = async () => {
        var designation = new Promise((resolve, reject) => {
            connection.query("SELECT * FROM designations WHERE status=1", (err, result) => {
                if (err) {
                    resolve([])
                }
                else {
                    resolve(result)
                }
            })
        })
        var department = new Promise((resolve, reject) => {
            connection.query("SELECT * FROM departments WHERE status=1", (err, result) => {
                if (err) {
                    resolve([])
                }
                else {
                    resolve(result)
                }
            })
        })

        const [designations, departments] = await Promise.all([designation, department])
        return res.status(200).json({designations, departments})
    }


    fetchAsyncData();
}