import fs from "fs";
import moment from "moment";
import multer from "multer";
import { apiHandler } from 'helpers/api';
const connection = require("helpers/api/routes/pool.js");

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination: "./public/policies",
});

const upload = multer({ storage: storage });

export default apiHandler({
  get: getById,
  put: update,
  delete: _delete
});



//update

function update(req, res) {
  const updatedId = req.query.id;

  connection.query(
    "SELECT * FROM policies WHERE id = ? and status != 0",
    [updatedId],
    (err, result) => {
      if (err) { console.error(err.message); res.status(500).json({ error: err.message }) }
      if (result.length === 0) { res.status(404).json({ message: "policy file not found", status: 0 }) }
      const val = result[0];
      // console.log("Existing Value:", val);

      if (val.status === 0) { res.status(200).json({ message: "cannot modify the fields", status: 0 }) }

      upload.single("file")(req, res, async (err) => {


        if (!req.file) {
          const currentTime = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
          const { name, description } = req.body;
          const nameToUpdate = name || val.name;
          const descriptionToUpdate = description || val.description;

          let q =
            "UPDATE policies SET name=?, description=?, modified=? WHERE id=? AND status != 0";
          const values = [nameToUpdate, descriptionToUpdate, currentTime, updatedId];


          connection.query(q, values, (err, results, fields) => {
            if (err) { console.error(err.message); res.status(500).json({ error: "DB error", status: 0 }); }
            else {
              console.log("Rows Affected:", results.affectedRows);
              console.log("Updated Id:", updatedId);
              return res.status(200).json({ message: "policies without file Updated Successfully", status: 1 });
            }
          });
        }else{

        

            const { path, originalname: originalFileName } = req.file;
            const currentTime = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");

            const fileeName = originalFileName.split(".")[0];
            const extName = originalFileName.split(".")[1];

            const nameFromForm = req.body.name;
            const name = nameFromForm || fileeName;

            // Generate 8-digit random number
            const randomNum = Math.floor(Math.random() * 100000000);
            const newFileName = `${name}_${randomNum}.${extName}`;

            const convertedFilePath = `public/policies/${newFileName}`;
            const convertedFilePath1 = `/policies/${newFileName}`;

            const { ...filess } = req.body;
            const description = filess.description || "-";

            fs.rename(path, convertedFilePath, (err) => {
              if (err) {
                console.error("Error moving file", err); res.status(500).json({ message: "Internal Server Error", status: 0 })
              }

              let query = "UPDATE policies SET name=?, description=?, path=?, modified=? WHERE id=? AND status != 0";
              const values = [name, description, convertedFilePath1, currentTime, updatedId];

              connection.query(query, values, (err, result) => {
                if (err) {
                  console.error("Error querying data from the database", err);
                  res.status(500).json({ message: "Internal Server Error", status: 0 });
                }

                return res.json({
                  message: "File updated successfully",
                  status: 1,
                });
              });
            });

          }
      });
    }
  );
}

// Update without file

 







//delete

function _delete(req, res) {
  const id = req.query.id;

  connection.query("SELECT * FROM policies WHERE id=? and status !=0", [id], (err, result) => {
    if (err) { res.json({ error: err.message }); }
    if (result.length === 0) { res.json({ data: "policy file not found" }); }

    const del = "UPDATE `policies` SET `status`=0 WHERE `id`=?";
    connection.query(del, [id], function (error, result, fields) {
      if (error) { res.json({ error: "DB error", status: 0 }); }
      return res.json({ message: "policies data Deleted Successfully", status: 1 });
    });
  });
}






//getById


function getById(req, res) {
  const id = req.query.id;

  const getQuery = 'SELECT id,name,description,path,status,created,modified FROM policies WHERE id=? AND status =1';

  connection.query(getQuery, [id], (err, results) => {
    const data = Object.values(JSON.parse(JSON.stringify(results)));
    console.log("data:", data[0]);

    if (err) { console.log('Error executing query:', err); res.json({ error: err.message }); }

    if (results.length === 0) { res.json({ message: "policy file not found", status: 0 }); }
    else {
      if (typeof data[0] === "undefined") { res.json({ message: "policies cannot find the properties", status: 0 }); }

      if (typeof data[0] !== "undefined") { return res.json(data[0]); }
    }
  });
}