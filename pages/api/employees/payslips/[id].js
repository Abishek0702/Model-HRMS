import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
import moment from 'moment';

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});

// get family details by id
function getById(req, res) {

    // if (req.user.designation !== "admin") {
    //     res.status(200).json({ message: "Access Denied" })
    // }
    

    const id = req.query.id;

    connection.query('SELECT employeepayslips.*, users.employeeID as EmployeeCode, users.name as Name,employeepayslips.id as pid ,users.date_of_joining as DOJ FROM `employeepayslips` LEFT JOIN users ON users.id = employeepayslips.user_id WHERE employeepayslips.`user_id`=? and employeepayslips.status=1', [id], (err, results) => {

        const data = Object.values(JSON.parse(JSON.stringify(results)));
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
        else if (typeof data[0] === 'undefined') {
            res.status(200).json({ message: 'family details not found', status: 0 });
        }
        else {
            return res.json(data);
        }
    });
}

function calculatePercent(percent, num){
    return Math.round((percent / 100) * num);
}

// update family details
function update(req, res) {
    if (req.user.designation != "admin")
        return res.status(200).json({ data: "access denined", status: 0 });

    const updatedId = req.query.id;
    var updatedTime = moment.utc().format("YYYY-MM-DD HH:mm");

    connection.query("SELECT * FROM employeepayslips WHERE status=1 AND id=?", [updatedId], (err, result) => {
		 var val = JSON.parse(JSON.stringify(result));
        if (err) {
            return res.json({ Error: err.message });
        }else if (typeof result[0] == "undefined") {
            return res.json({ data: "user not found" });
        } else if (val.status === 0) {
            return res.status(200).json({ message: 'Cannot modify the fields of inactive board types', status: 0 });
        }else {
           

		   let q = "UPDATE `employeepayslips` SET  `CTC`=?,`MonthlyGross`=?,`Basic`=?,`HouseRentAllowance`=?,`OtherAllowance`=?,`EmployersContributiontoPF`=?,`EmployersContributiontoESI`=?,`EmployeesContributiontoPF`=?,`EmployeesContributiontoESI`=?,`TotalDeduction`=?,`TotalNetSalary`=?,`Remarks`=?,`salarymonth`=?,`modified`=? WHERE `id`="+updatedId;
		   const { ...user } = req.body;

           

            // CTC
            if (typeof user.CTC !== "undefined" && user.CTC !== "") {
                var CTC = user.CTC;
            }  else {
                var CTC = val[0].CTC;
            }
			
			// MonthlyGross
            if (typeof user.MonthlyGross !== "undefined" && user.MonthlyGross !== "") {
                var MonthlyGross = user.MonthlyGross;
            }  else {
                var MonthlyGross = val[0].MonthlyGross;
            }

            // Remarks
            if (typeof user.Remarks !== "undefined" && user.MonthlyGross !== "") {
                var Remarks = user.Remarks;
            }  else {
                var Remarks = val[0].Remarks;
            }
             // salarymonth
             if (typeof user.salarymonth !== "undefined" && user.salarymonth !== "") {
                var salarymonth = user.salarymonth;
            }  else {
                var salarymonth = val[0].salarymonth;
            }


            var Basic=parseInt((MonthlyGross*0.75).toFixed(0));
            var HouseRentAllowance=parseInt((Basic*0.25).toFixed(0));
            var OtherAllowance=parseInt((MonthlyGross- (Basic+HouseRentAllowance)).toFixed(0)) ; //=F2-sum(G2:H2)
            
            var EmployersContributiontoPF=1800; //=G2*12%
            if(MonthlyGross<15000){ EmployersContributiontoPF=calculatePercent(12,Basic); }
            
            var EmployersContributiontoESI=0; //=IF(F2>20999,0,((F2)*3.25/100))
            if(MonthlyGross<=20999){ EmployersContributiontoESI=parseInt((MonthlyGross*3.25/100).toFixed(0)); }
            
            
            var EmployeesContributiontoPF=parseInt(EmployersContributiontoPF); 
            
            var EmployeesContributiontoESI=0;  //=IF(F2>20999,0,((F2)*0.75/100))
            if(MonthlyGross<=20999){ EmployeesContributiontoESI=parseInt((MonthlyGross*0.75/100).toFixed(0)); }
            
            var TotalDeduction=parseInt(EmployersContributiontoPF+EmployeesContributiontoESI);
            var TotalNetSalary=parseInt(( (MonthlyGross-(EmployersContributiontoPF+EmployersContributiontoESI)-TotalDeduction)).toFixed(0)) ; //=F2-SUM(J2:K2)-N2
          

           

            let dataUpdate = [CTC, MonthlyGross, Basic, HouseRentAllowance, OtherAllowance, EmployersContributiontoPF, EmployersContributiontoESI, EmployeesContributiontoPF, EmployeesContributiontoESI, TotalDeduction, TotalNetSalary, Remarks, salarymonth,  updatedTime];

            console.log(dataUpdate);

            connection.query(q, dataUpdate, (err, result, fields) => {
                if (err) {
                    console.log("err", err);
                }
                else {
                    return res.status(200).json({ message: 'Successfully updated the schedule', status: 1, });
                }
            });
        }
    });
}


// Delete family details
function _delete(req, res) {

    if (req.user.designation !== "admin") {
        res.status(200).json({ message: "Access Denied" })
    }

    const id = req.query.id;

    connection.query('SELECT * FROM `employeepayslips` WHERE `id`=? and status=1', [id], (err, result) => {
        if (err) {
            res.json({ Error: err.message });
        }
        else if (typeof result[0] == 'undefined') {
            res.status(200).json({ message: 'course could not be deleted', status: 0 });
        }
        else {
            var del = 'UPDATE `employeepayslips` SET `status`=0 WHERE `id`=?';

            connection.query(del, [id], function (error, result, fields) {
                if (error) {
                    return res.status(200).json({ message: 'failed', status: 0 });
                }
                return res.json({ message: 'success', status: 1 });
            });
        }
    });
}
