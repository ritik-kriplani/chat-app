import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProduction = ENV.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in MS
    httpOnly: true, // prevent XSS attacks
    sameSite: isProduction ? "none" : "lax", // mandatory for cross-domain hosting (e.g. Vercel frontend + Render backend)
    secure: isProduction, // mandatory when sameSite is 'none'
  });

  return token;
};

// http://localhost
// https://dsmakmk.com
