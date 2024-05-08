const bcrypt = require("bcryptjs");

import { apiHandler } from "helpers/api";
const connection = require("helpers/api/routes/pool.js");

export default apiHandler({
 
  get: employee
  

}); 

function employee(req, res) {

  const fetchAsyncData = async () => {
     

    const approver = new Promise((resolve, reject) => {
      connection.query("SELECT users.id, users.name, users.designation_id, designations.designationName FROM `users` LEFT JOIN `designations` designations ON users.designation_id = designations.id WHERE users.department_id <=4",(err, result) => {
        if (err) {
          resolve([]); 
        } else {
          resolve(result);
        }
      });
    });

    const leavetypes = new Promise((resolve, reject) => {
      connection.query('SELECT id,TypeOFleave FROM leavetypes', (err, result) => {
        if (err) {
          resolve([]);
        } else {
          resolve(result);
        }
      });
    });

    const designationNames=new Promise((resolve,reject)=>{
      connection.query('SELECT id,designationName FROM designations WHERE id !=4',(err,result)=>{
        if(err){
          resolve([])

        }
        else{
          resolve(result);
        }
      })
    })


    

    try {
      const [employees,types,design] = await Promise.all([approver, leavetypes,designationNames]);
      
      res.status(200).json({ employees, types,design});
    } catch (error) {
     
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  fetchAsyncData();
}





