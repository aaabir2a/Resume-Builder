import { NextResponse } from "next/server";
import { findCVById } from "@/lib/models";
import { toObjectId } from "@/lib/auth";



// Get CV by ID
export async function GET(request, { params }) {
  try {
    const id = params.id;

    // Find CV by ID
    const cv = await findCVById(toObjectId(id));

    if (!cv) {
      return NextResponse.json({ message: "CV not found" }, { status: 404 });
    }

    return NextResponse.json(cv);
  } catch (error) {
    console.error("Get CV by ID error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
