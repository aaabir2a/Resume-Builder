import { NextResponse } from "next/server";
import { createCV, findCVByUserId, updateCV } from "@/lib/models";
import { verifyToken } from "@/lib/auth";

export const config = {
  runtime: "nodejs",
};

// Create or update CV
export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader.split(" ")[1];
    const { decoded } = verifyToken(token);

    const userId = decoded.userId;
    const cvData = await request.json();

    // Check if user already has a CV
    const existingCV = await findCVByUserId(userId);

    let result;
    if (existingCV) {
      // Update existing CV
      result = await updateCV(existingCV._id, {
        ...cvData,
        userId,
        updatedAt: new Date(),
      });

      return NextResponse.json({
        message: "CV updated successfully",
        cvId: existingCV._id,
      });
    } else {
      // Create new CV
      result = await createCV({
        ...cvData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return NextResponse.json(
        {
          message: "CV created successfully",
          cvId: result.insertedId,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("CV save error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user's CV
export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader.split(" ")[1];
    const { decoded } = verifyToken(token);

    const userId = decoded.userId;

    // Find CV by user ID
    const cv = await findCVByUserId(userId);

    if (!cv) {
      return NextResponse.json({ message: "CV not found" }, { status: 404 });
    }

    return NextResponse.json(cv);
  } catch (error) {
    console.error("Get CV error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
