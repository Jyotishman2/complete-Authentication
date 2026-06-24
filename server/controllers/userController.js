import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken";

export const getUserData = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json({ success: false, message: "Not Authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

       res.json({
  success: true,
  user
});

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};