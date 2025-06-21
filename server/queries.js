import pg from "pg";
import env from "dotenv";
import multer from "multer"
import express from "express";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

env.config();

const db = new pg.Client({
  user:"postgres",
  password: process.env.DB_PASS,
  database: "pshare",
  host:'localhost',
  port: 5432
});

db.connect();


const upload = multer({ storage });

const getAllData = ( req, res ) => {
  db.query("SELECT * FROM posts", (error, result) => {
    if(error){
      console.log("error = ", error)
      throw error;
    }

    // console.log("result = ", result.rows)
    //res.status(201).send("All data retrieved!");
    res.status(200).json(result.rows)
  })


}


 const insertData = app.post('/api/submit', upload.single('file'),  (req, res) => {
  const { user, title, description } = req.body;
  const { filename } = req.file;

  const { originalname } = req.file;

  /*
  Keep note, just doing req.body wont output anything. Youd need to add the key as well such as req.body.user to show what data is being passed, in this case, the user 
  */
  console.log("req.body.user = ", user)
  console.log("req.body.title = ", title)
  console.log("req.body.description = ", description)
  console.log("req.file.filename = ", filename)

  console.log("req.file.originalname = ", originalname)


  // res.json({ message: 'File uploaded successfully', file: req.file });

  // console.log("req.body = ", req.body)
  // const { user, title, text, img_path } = req.body; //test

  // const imagePath = `/uploads/${req.file.filename}`;

  db.query(`INSERT INTO posts (usernames, title, text, image_path) VALUES ($1,$2,$3,$4) RETURNING *`, [ user, title, description, filename ], (error) => {
    if(error){
      console.log("error = ", error)
      throw error;
    }
    //I kept getting error whenever I reload. It would just be stuck loading cause of this => res.status(201).send(`Info added!`);  so I took it out
  });

  // res.status(201).json({ message: "Data received", text});
});

/* I had a issue where I was using this line of code 

result.status(201).send(`Info added!`);

which I placed on line 74. I kept getting erros from google chrome dev console and was wondering what the issue was until I fixed this by removing that line of code. I need to keep note that:

res is the Express response object used to respond to the HTTP client.

result is the PostgreSQL query result, which has no status() or send() methods.


*/





export  { db, insertData , getAllData };