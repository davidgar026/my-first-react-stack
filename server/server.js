import express from "express";
import bodyParser from "body-parser"
import cors from "cors";

const app = express();
const port = 4000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


app.get("/", (req,res) => {
    res.send(`<h1>Hello</h1>`)
})

app.get("/api/message", (req, res) => {
    res.json({message: "Message from the server. Whats up!"})
});


app.post('/api/submit', (req ,res) => {
    console.log(`Reqeust received: `, req.body);
    res.status(200).json({ data: "From the backend, message received! "})
})


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})