import { apiHandler, usersRepo, omit } from 'helpers/api';

const connection = require('helpers/api/routes/pool.js');
export default apiHandler({
	get: getUsers
});

function getUsers(req, res) {
	// return users without hashed passwords in the response

	console.log('query---', req.query.page, req.query.size);

	if (typeof req.query.size !== 'undefined') { var numPerPage = req.query.size; } else { var numPerPage = 6; }
	if (typeof req.query.page !== 'undefined') { var page = req.query.page; } else { var page = 1; }
	if (typeof req.query.search !== 'undefined') { var search = req.query.search; } else { var search = ""; }


	//start
	var skip = (page - 1) * numPerPage;
	var limit = skip + ',' + numPerPage; // Here we compute the LIMIT parameter for MySQL query
	connection.query('SELECT count(*) as numRows FROM leavestatus', function (err, rows, fields) {

		if (err) {
			console.log("error: ", err);
			return res.status(200).json([]);
		} else {
			var numRows = rows[0].numRows;
			var numPages = Math.ceil(numRows / numPerPage);

			if (search != "") {
				var q = 'SELECT * FROM leavestatus WHERE name LIKE  "%' + search + '%" AND status =1 ORDER BY id desc LIMIT ' + limit;

			}
			else {
				var q = "SELECT * FROM `leavestatus` WHERE status=1  ORDER BY id desc LIMIT "+ limit ;
			}
			console.log("q: ", q);

			connection.query(q, function (err, rows, fields) {
				const data = Object.values(JSON.parse(JSON.stringify(rows)));
				if (err) {
					console.log("error: ", err);
					return res.status(200).json([]);
				} else {
					//console.log("promisedata:", data[0]);
					var promises = [];
					for (var i = 0; i < data.length; i++) {
						data[i].star = '';
						promises.push(data[i]);
						//console.log("loopdata:", data[1]);
					}
					Promise.all(promises).then(function (resp) {
						return res.status(200).json({ numRows: numRows, numPages: numPages, page: page, limit: limit, posts: data });
					}).catch(err => {
						return res.status(200).json([]);
					});
				}
			});
		}
	});
	///end

}







