import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/models";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await createUser({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Generate token
    const user = { _id: result.insertedId, email };
    const token = generateToken(user);

    return NextResponse.json(
      {
        message: "User created successfully",
        token,
        user: {
          id: result.insertedId,
          name,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
