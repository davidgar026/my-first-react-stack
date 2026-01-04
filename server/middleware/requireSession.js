export function requireSession(req, res, next){
    const id = req.signedCookies ?.sessionId;
    if(!id) return res.status(401).json({error: "Not authenticated"});
    const session = req.sessionStore.get(id);
    if(!session) return res.status(401).json({error: "Session expired"});
    req.user = session.user; // { id, username }
    next();
}