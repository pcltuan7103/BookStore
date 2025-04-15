import jwt from "jsonwebtoken";
import User from "../models/User";

const protectRoutes = async (req, res, next) => {
    try {
        //Get token
        const token = req.header("Authorization").replace("Bearer ", "");

        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Find user
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default protectRoutes;