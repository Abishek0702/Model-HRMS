import moment from 'moment';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { apiHandler } from 'helpers/api';
const connection = require('helpers/api/routes/pool.js');

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination: './public/events',
});

const upload = multer({ storage: storage });

export default apiHandler({
  post: addEvents
});

function addEvents(req, res) {
  upload.single('file')(req, res, (err) => {
    if (err) { return res.status(500).json({ message: 'Internal Server Error', status: 0 }); }
    else {
      if (!req.file) { return res.status(500).json({ message: 'No file uploaded', status: 0 }); }
      else {
        const createdTime = moment.utc().utcOffset('+05:30').format('YYYY-MM-DD hh:mm:ss');
        const { path: filePath, originalname: originalFileName } = req.file;

        const fileName = originalFileName.split('.')[0];
        const extName = originalFileName.split('.')[1];

        const nameFromForm = req.body.name;
        const name = nameFromForm || fileName;

        // Generate 8-digit random number
        const randomNum = Math.floor(Math.random() * 100000000);
        const newFileName = `${name}_${randomNum}.${extName}`;
        console.log("newdfilename : ", newFileName);

        // New filepath
        const convertedFilePath = path.join('public', 'events', newFileName);
        const fp = path.join('events', newFileName);
        const { ...files } = req.body;
        const event_type_id = files.event_type_id || '-';
        const event_date = files.event_date || '-';
        const title = files.title || '-';
        const description = files.description || '-';
        const link = files.link || '-';

        connection.query('SELECT * FROM geons_events WHERE title = ? and status=1', [title], function (error, result, fields) {
          fs.rename(filePath, convertedFilePath, (err) => {
            if (err) {
              console.error('Error moving file', err);
              return res.status(500).json({ message: 'Internal Server Error', status: 0 });
            }
            else {
              const insertQuery = `INSERT INTO geons_events(id, event_type_id, event_date, title, description, path, link, status, created_at, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
              const values = [null, event_type_id, event_date, title, description, fp, link, 1, createdTime, createdTime];

              connection.query(insertQuery, values, (err, results) => {
                console.log("values",fp);
                if (err) { console.error(err.message); return res.status(500).json({ error: 'DB error', details: err.message }); }
                else { return res.status(200).json({ message: 'Event add Successfully', status: 1, }); }
              });
            }
          });
        });
      }
    }

  });
};
