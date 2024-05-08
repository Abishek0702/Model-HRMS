var mysql      = require('mysql');
const dbconnection =()=>{
	var connection = mysql.createConnection({
		 host     : process.env.host,
		  user     : process.env.user,
		  password : process.env.password,
		  database : process.env.database,
		
		multipleStatements: true,
		charset: "utf8mb4",
		connectionLimit: 15,
		queueLimit: 30,
		acquireTimeout: 1000000
	});
	return connection;
}
module.exports = {
	dbconnection
}

 
