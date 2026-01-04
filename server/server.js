import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername } from "./db/queries.js";
import cors from "cors";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { insertPost, getAllData, deletePostById, updatePostById } from "./db/queries.js";
import authRoutes from "./routes/authRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import { openai } from "./utils/aiClient.js"

dotenv.config();

const app = express();
const port = 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JWT_SECRET = process.env.JWT_SECRET;

console.log(path.join(__dirname, "uploads"));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/posts", postsRoutes);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //allows cookies over CORS
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);


//A simple test to ensure API key works and were hitting the openai server
app.get("/api/ai/ping", async (req, res) => {
  try{
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system",
          content: "Reply very briefly."
        },
        {
          role: "user",
          content: "Say 'ping my pong' and nothing else."
        },
      ],
      max_tokens: 10,
      temperature: 0,
    });

    const text = response.choices[0]?.message?.content?.trim();

    return res.json({ ok: true, reply: text });


  }catch(err){
    console.error("AI ping error: ", err)
    return res.status(500).json({ ok: false, error: "AI call failed" });
  }
});





//Generate a post using AI
app.post("/api/ai/generate-post", async (req, res) => {
  try{
    const { prompt, tone = "tumblr", maxWords = 100 } = req.body;

    // 1 Validate input
    if( !prompt || !prompt.trim() ){
      return res.status(400).json({ ok: false, error: "prompt is required." });
    }

    // 2 Ask model exactly what format and info to return back
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: " You generate short Tumblr-style post ideas. Always return ONLY valid JSON with keys: title, description. No extra keys. No markdown.",
        },
        {
          role: "user",
          content: `
            Idea: ${prompt}
            Tone: ${tone}
            Rules:
            - title: catchy, max 80 characters
            - description: max ${maxWords}
            Return ONLY JSON.
          `
        },
      ],
      //Ensures again that the model outputs strict JSON
      response_format: { type: "json_object" },
      max_tokens: 220,
      temperature: 0.8,
    });

    //3 extract output
    const raw = response.choices[0]?.message?.content;

    //4 parse string into JS object
    const parsed = JSON.parse(raw);

    //5 return response to frontend
    return res.json({
      ok: true,
      title: parsed.title ?? "",
      description: parsed.description ?? "",
    });
  }catch(err){
    console.error("generate-post error:", err);
    return res.status(500).json( { ok: false, error: "Failed to generate post" });
  }
});




// Multer used for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

//GET retrieve all posts
app.get("/api/getData", async (req, res) => {
  try {
    const posts = await getAllData();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

//LOGIN
// app.post("/api/login", async (req, res) => {
//   const { username, password } = req.body;
//   const user = await findUserByUsername(username);

//   if (!user) {
//     return res.status(400).json({ error: "User not found." });
//   }

//   const isMatch = await bcrypt.compare(password, user.password); //compares the inputted password with the actual user's password in the db
//   if (!isMatch) {
//     return res.status(400).json({ error: "Credentials is incorrect." });
//   } //if password is incorrect, an error is returned

//   // assigns a token once user is found in the db and credentials is verified
//   const token = jwt.sign(
//     { id: user.id, username: user.username },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
//   res.json({ token }); //resppnds with a object containing a token
// });

// //SIGNUP
// app.post("/api/signup", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const existingUser = await findUserByUsername(username);
//     if (existingUser) {
//       return res.status(500).json({ error: "User already exists. " });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await createUser(username, hashedPassword);
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Signup failed." });
//   }
// });

//POST create a new post with a file input
app.post("/api/submit", upload.single("file"), async (req, res) => {
  try {
    const { user, title, description } = req.body;
    const filename = req.file ? req.file.filename : null;
    const newPost = await insertPost(user, title, description, filename);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ json: "Failed to add a post." });
  }
});

//DELETE delete a post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    await deletePostById(postId);
    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post." });
  }
});

//UPDATE a post
app.patch("/api/posts/:id", upload.single("file"), async (req, res) => {
  try {
    const postId = req.params.id;
    //retrieve the updated data from request
    const { title, text } = req.body;
    //if a file was uploaded, get its filename
    const image_path = req.file ? req.file.filename : req.body.image_path;
    console.log("PATCH DATA:", { postId, title, text, image_path }); // <-- Add this
    //pass to query
    await updatePostById(postId, title, text, image_path);
    res.status(200).json({ message: "Post updated succesfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update post. "});
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
