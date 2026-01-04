import express from "express"
import bcrypt from "bcrypt";
import { findUserByUsername, createUser } from "../db/queries.js";
import { signAccess, signRefresh, verifyAccess, verifyRefresh } from "../utils/authTokens.js";
import { setRefreshCookie, clearRefreshCookie } from "../utils/cookies.js"

const router = express.Router();

const requireAccess = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = verifyAccess(token); // attach payload
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid access token" });
  }
};

//SIGNUP - user sign up + authentication
router.post("/signup", async (req, res) => {
    try{
       let { username, password } = req.body;
    username = ( username || "").trim();
    password = ( password || "").trim();

    if(!username || !password){ return res.status(400).json({ error: "Username and password are required." }) };

    const hash = await bcrypt.hash( password, 10 );
    const user = await createUser( username, hash );

    const access = signAccess({ id: user.id, username: user.username }); //requests a access token (shortlived)
    const refresh = signRefresh({ id: user.id, username: user.username }); //requests a refresh token (long lived)
    setRefreshCookie(res, refresh); //prevents XSS attacks by attaching refresh token to a HTTP-only cookie

    return res.status(201).json({ user: { id: user.id, username: user.username }, accessToken:  access })
 
    }catch(err){
        console.error("Signup error");
        return res.status(500).json({ error: "Server error. Please try again." })
    }
    
});

//LOGIN - user login + authentication
router.post("/login", async ( req, res ) => {
    const { username, password } = req.body;
    const user = await findUserByUsername( username );
    if(!user){ return res.status(401).json({ error: "Invalid Credentials" })}

    const ok = await bcrypt.compare( password, user.password );
    if(!ok){ return res.status(401).json({ error: "Invalid Credentials" })}

    const access = signAccess({ id: user.id, username: user.username });
    const refresh = signRefresh({ id: user.id, username: user.username });
    setRefreshCookie(res, refresh);

    res.status(200).json({ user: { id: user.id, username: user.username }, accessToken:  access  })
});

//REFRESH - validates refresh token  (from http-only cookie) . If valid, user is given a short-lived access token to access authenticated requests without re-logging in.
router.post("/refresh", (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    const p = verifyRefresh(token); // throws on invalid/expired
    const access = signAccess({ id: p.id, username: p.username });
    return res.json({ accessToken: access, user: { id: p.id, username: p.username } });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});



//Current User (Uses access token)
router.get("/me", requireAccess, async (req, res) => {
    const { id, username } = req.user;
    res.json({ user: { id, username } });
})

// LOGOUT
router.post("/logout", (req, res) => {
    clearRefreshCookie(res);
    // (Optional: revoke refresh in DB)
    res.json({ message: "Logged out" });
});

export default router;