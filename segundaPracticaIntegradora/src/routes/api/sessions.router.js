import { Router } from "express";
import { passportCall } from "../../config/passport.config.js";

const router = Router();

router.get("/current", passportCall("jwt"), async (req, res) => {
  res.send({ status: "success", payload: req.user });
});

export default router;
