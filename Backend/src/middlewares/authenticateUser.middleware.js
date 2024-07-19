import { User } from "../models/user.model.js";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const authenticateUser = asyncHandler(async (req, res, next) => {
	try {
		const accessToken =
			req.cookies?.accessToken ||
			req.header("Authorization")?.replace("Bearer ", "");

		if (!accessToken) {
			console.log("1")
			throw new APIError(401, "Unauthorized Request");
		}

		const verifiedToken = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET
		);

		if (!verifiedToken) {
			console.log("1")
			throw new APIError(401, "Unauthorized Request");
		}

		const user = await User.findById(verifiedToken._id).select(
			"_id username email"
		);
		if (!user) {

			throw new APIError(404, "User not found.");
		}
		req.user = user;
		console.log("req.user", req.user);
		next();
	} catch (error) {
		throw new APIError(500, error.message);
	}
});
