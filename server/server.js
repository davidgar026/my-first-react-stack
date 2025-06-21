import express from "express";
import bodyParser from "body-parser"
import cors from "cors";
import multer from "multer";
import pg from "pg";
import env from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { insertData, getAllData, db} from "./queries.js";

//import mongoose from "mongoose";
 
// async function connectToDatabase() {
//   try {
//     await mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.error('Connection error:', err);
//   }
// }


 
// connectToDatabase();

const app = express();
const port = 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


console.log(path.join(__dirname, 'uploads'));

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));






app.get("/", (req,res) => {
    res.send(`<h1>Hello</h1>`)
})

app.get("/api/getData", getAllData);

app.post("/api/submit", insertData);


// const upload = multer({ dest: 'uploads/' });

// app.post('/uploads', upload.single('image'), (req, res) => {
//   console.log("req.file = ", req.file);
//   console.log('req.file.path = ', req.file.path)
  

// //   db.query(`INSERT INTO posts (image_path) VALUES ($1) RETURNING *`, [ img_path ], (error, result) => {
// //     if(error){
// //       console.log("error = ", error)
// //       throw error;
// //     }
// });

// app.post('/api/submit', (req ,res) => {
//     console.log(`Reqeust received: `, req.body);
//     console.log("req.body = ", req.body)
//     res.status(200).json({ data: "From the backend, message received! "})
// })


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})