import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// configuration for connecting to DB
const pool = new pg.Pool({
  user:"postgres",
  password: process.env.DB_PASS,
  database: "pshare",
  host:'localhost',
  port: 5432
});

// capture all data from DB
export const getAllData = async () => {
  const result = await pool.query("SELECT * FROM posts ORDER BY created_at ASC");
  return result.rows;
}
// insert a new post
 export const insertPost = async ( user, DataTransferItemList, RTCSessionDescription, filename ) => {
  const result = await pool.query(`
    INSERT INTO posts ( usernames, title, text, image_path )
    VALUES ($1, $2, $3, $4) RETURNING *`,
    [ user, DataTransferItemList, RTCSessionDescription, filename ]
  )
  return result.rows[0];
 }

 // login & signup
 export const findUserByUsername = async ( username ) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0];
 }

 // create new user
 export const createUser = async ( username, hashedPassword ) => {
  const result = await pool.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username", [ username, hashedPassword]);
  return result.rows[0];
 }

 //delete a post by ID
 export const deletePostById = async ( id ) => {
  await pool.query("DELETE FROM posts WHERE id = $1", [ id ])
 }

 //update a post by ID
 export const updatePostById = async (id, title, text, image_path) => {
  await pool.query(`UPDATE posts SET title = $2, text = $3, image_path = $4 WHERE id = $1`, [ id, title, text, image_path]);
 };




