import { apiHandler, usersRepo, omit } from 'helpers/api';

const  connection = require('helpers/api/routes/pool.js');
export default apiHandler({
    get: getUsers
});


function getUsers(req, res) {
    // return users without hashed passwords in the response
	if (req.user.designation!="admin")
	return res.status(200).json({ data: "access denined", status: 0 }); 
	  
	  if(typeof req.query.id!=='undefined'){
		  var id=req.query.id;  
			connection.query('SELECT * FROM leavemanagements WHERE id = ?',[id], function (error, results, fields) {
					const data = Object.values(JSON.parse(JSON.stringify(results)));
					// console.log('results-',data);  
					if(error){	 
						return res.status(200).json([]);
					}else{
						return res.status(200).json(data[0]);
					}
			 });
	  }else{
		  return res.status(200).json([]);
	  }
}



