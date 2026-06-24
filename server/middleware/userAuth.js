import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        console.log("TOKEN:", token); // 🔥 DEBUG

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized. Login Again"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.json({
                success: false,
                message: "Invalid Token"
            });
        }

        req.userId = decoded.id;

        next();

    } catch (error) {
        console.log("AUTH ERROR:", error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

export default userAuth;