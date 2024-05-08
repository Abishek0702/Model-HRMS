const connection = require('helpers/api/routes/pool.js');


const autocomplete = async (q, val) => {
    return new Promise((resolve, reject) => {
        connection.query(q, val, (err, result) => {
            if (err) {
                console.log("error:", err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

const fetchroledata = async (q, val) => {
    return new Promise((resolve, reject) => {
        connection.query(q, val, (err, result) => {
            if (err) {
                console.log("error:", err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const stringfyData = async (data) => {
    try {
        var data1 = Object.values(JSON.parse(JSON.stringify(data)));
        if (data1.length > 1) {
            return data1;
        } else {
            return data1[0];
        }
    } catch (error) {
        throw error;
    }
}





const fetchFormdata = async (q) => {
    return new Promise((resolve, reject) => {
        // console.log("q:", q);
        connection.query(q, (err, result) => {
            // console.log("ERR..", err);
            if (err) {
                // throw err
                console.log("ERR..", err);
                resolve([])
            } else {
                resolve(result);
            }
        }
        );
    });
}


module.exports = { autocomplete, fetchroledata, stringfyData, fetchFormdata }