import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";

// Hash password
export async function hashPassword(password) {
  return await hash(password, 12);
}

// Compare password with hash
export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user) {
  return sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Verify JWT token
export function verifyToken(token) {
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
}

// Convert string ID to MongoDB ObjectId
export function toObjectId(id) {
  return new ObjectId(id);
}
