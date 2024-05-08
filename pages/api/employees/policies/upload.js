import fs from "fs";
import moment from "moment";
import multer from "multer";
import path from "path";
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
  post: add
});

function add(req, res) {

  upload.single("file")(req, res, async (err) => {
    if (!req.file) {
      res.status(500).json({ message: "File was not uploaded", status: 0 });
    }

    console.log("req.file:", req.file);

    const { path: filePath, originalname: originalFileName } = req.file;
    const currentTime = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    const fileName = originalFileName.split(".")[0]; // split Name
    const extName = originalFileName.split(".")[1];  // split extention

    const nameFromForm = req.body.name;
    const name = nameFromForm || fileName;

    // Generate 8-digit random number
    const randomNum = Math.floor(Math.random() * 100000000);
    const newFileName = `${name}_${randomNum}.${extName}`;

    const convertedFilePath = path.join("public", "policies", newFileName);
    const { ...filess } = req.body;
    const description = filess.description || "-";
    const status = filess.status || "1";

    var newfilepath="/policies/"+newFileName;

    connection.query('SELECT * FROM policies WHERE name = ? and status !=0', [name], function (error, result, fields) {
      
      var st=1;
      if (result.length > 0) {
        var existingData = result[0];
        if (existingData.name === name) {
          st=0;
          res.status(200).json({ message: 'Data already exists', status: 0 });
        }
      }

       if(st==1){
            fs.rename(filePath, convertedFilePath, (err) => {
              if (err) {
                console.error("Error moving file", err);
                res.status(500).json({ message: "Internal Server Error", status: 0 });
              }else{

                let query =
                "INSERT INTO `policies` (`id`,`name`,`description`,`path` ,`status`,`created`,`modified`) VALUES (?,?,?,?,?,?,?)";
                let data = [
                  null,
                  name,
                  description,
                  newfilepath,
                  
                  status,
                  currentTime,
                  currentTime,
                ];

              connection.query(query, data, (err, result) => {
                console.log("Result:", result);
                if (err) {
                  console.error("Error querying data from the database", err);
                  res.status(500).json({ message: "Internal Server Error", status: 0 });
                }else{
                  return res.json({ message: "File uploaded successfully", status: 1, });
                }
              });

              }

              
            });

        }
    });
  });
}