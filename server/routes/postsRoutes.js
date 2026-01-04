import { Router } from "express";

const router = Router();

router.get("/",  async (req, res) => {
  const posts = []; 
  res.json(posts);
});

export default router;