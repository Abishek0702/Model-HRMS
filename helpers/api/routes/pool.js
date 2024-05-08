var mysql = require('mysql');

// connect to the db
var dbConnectionInfo = {
	// host     : 'localhost',
	// user     : 'root',
	// password : 'Geons@346',
	// database : 'hrms_live',
  host     : process.env.host,
  user     : process.env.user,
  password : process.env.password,
  database : process.env.database,
	connectionLimit: 30 //mysql connection pool length
};


//For mysql single connection
/* var dbconnection = mysql.createConnection(
        dbConnectionInfo
); 

 dbconnection.connect(function (err) {
    if (!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
}); 

*/

//create mysql connection pool
var dbconnection = mysql.createPool(
  dbConnectionInfo
);

// Attempt to catch disconnects 
dbconnection.on('connection', function (connection) {
  console.log('DB Connection established');

  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });

});


module.exports = dbconnection;