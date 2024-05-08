import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');
const moment = require('moment');

export default apiHandler({
    post: add
});

function calculatePercent(percent, num){
    return Math.round((percent / 100) * num);
}

async function add(req, res) {

    try {
		console.log(req.body);

        var id = req.query.id;
        const currentTime = moment().utc().format('YYYY-MM-DD HH:mm');
        var { user_id, CTC, MonthlyGross,Remarks,salarymonth } = req.body;

        if (req.user.designation !== "admin") {
            res.status(200).json({ message: "Access Denied" })
        }  else if (!user_id && !CTC && !MonthlyGross) {
            res.status(400).json({ error: 'Missing required fields' });
        } else {
            var CTC = parseInt(CTC) || 0;
            var MonthlyGross = parseInt(MonthlyGross) || 0;
            var Basic=parseInt((MonthlyGross*0.75).toFixed(0));
            var HouseRentAllowance=parseInt((Basic*0.25).toFixed(0));
            var OtherAllowance=parseInt((MonthlyGross- (Basic+HouseRentAllowance)).toFixed(0)) ; //=F2-sum(G2:H2)
            
            var EmployersContributiontoPF=1800; //=G2*12%
            if(MonthlyGross<=20999){ EmployersContributiontoPF=calculatePercent(12,Basic); }
            
            var EmployersContributiontoESI=0; //=IF(F2>20999,0,((F2)*3.25/100))
            if(MonthlyGross<=20999){ EmployersContributiontoESI=parseInt((MonthlyGross*3.25/100).toFixed(0)); }
            
            
            var EmployeesContributiontoPF=parseInt(EmployersContributiontoPF); 
            
            var EmployeesContributiontoESI=0;  //=IF(F2>20999,0,((F2)*0.75/100))
            if(MonthlyGross<=20999){ EmployeesContributiontoESI=parseInt((MonthlyGross*0.75/100).toFixed(0)); }
            
            var TotalDeduction=parseInt(EmployersContributiontoPF+EmployeesContributiontoESI);
            var TotalNetSalary=parseInt(( (MonthlyGross-(EmployersContributiontoPF+EmployersContributiontoESI)-TotalDeduction)).toFixed(0)) ; //=F2-SUM(J2:K2)-N2
          
            var salarymonth = moment(salarymonth).utc().format('YYYY-MM-DD HH:mm');
            var Remarks= Remarks || "";
            var status =1;

            //SELECT * FROM employeepayslips WHERE user_id=44 and DATE_FORMAT(salarymonth, "%m")=08 and status=1; 
			 
            var salarymonth1 = moment(salarymonth).utc().format('MM');
            var q='SELECT * FROM employeepayslips WHERE user_id=? and DATE_FORMAT(salarymonth, "%m")='+salarymonth1+' and status=1';
            console.log(q);
            connection.query(q, [user_id], async (error, result) => {
                if (error) {
                    console.log('Error executing SELECT query:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
                else if (result && result.length > 0) {
                    res.status(200).json({ data: 'payslip details already exists', status: 0 });
                }
                else {
                    var insertQuery = 'INSERT INTO employeepayslips (`id`, `user_id`, `CTC`, `MonthlyGross`, `Basic`, `HouseRentAllowance`, `OtherAllowance`, `EmployersContributiontoPF`, `EmployersContributiontoESI`, `EmployeesContributiontoPF`, `EmployeesContributiontoESI`, `TotalDeduction`, `TotalNetSalary`, `Remarks`, `salarymonth`, `status`, `created`, `modified`) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?,?,?)';
                    var insertParams = [null, user_id, CTC, MonthlyGross, Basic, HouseRentAllowance, OtherAllowance, EmployersContributiontoPF, EmployersContributiontoESI, EmployeesContributiontoPF, EmployeesContributiontoESI, TotalDeduction,TotalNetSalary,Remarks,salarymonth, 1, currentTime, currentTime];

                    connection.query(insertQuery, insertParams, async (err) => {
                        if (err) {
                            console.log('Error executing INSERT query:', err);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        } 
                        else {
                            return res.status(200).json({ data: 'Successfully added the payslip', status: 1 });
                        }
                    });
                }
            });
        }
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}