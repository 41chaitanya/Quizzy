import userModel from "../models/user.model.js";
import blackListTokenModel from "../models/blackList.model.js";
import { verifyAccessToken } from "../utils/tokenHandler.js";

export const authMiddleware = async (req, res, next) => {

    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).send("Unauthorized");

    const blacklisted = await blackListTokenModel.findOne({ token });

    if (blacklisted) return res.status(401).send("Unauthorized");

    const decoded = verifyAccessToken(token);

    req.user = { id: decoded.id };

    next();
}