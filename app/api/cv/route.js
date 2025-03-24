import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise
    const db = client.db()
    const cvsCollection = db.collection("cvs")

    const cvs = await cvsCollection.find({ userId: user._id }).sort({ lastUpdated: -1 }).toArray()

    return NextResponse.json({ cvs });
  } catch (error) {
    console.error("Get CVs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cvData = await req.json()

    const client = await clientPromise
    const db = client.db()
    const cvsCollection = db.collection("cvs")

    const now = new Date()
    const newCV = {
      ...cvData,
      userId: user._id,
      lastUpdated: now,
      progress: cvData.progress || 0,
    }

    const result = await cvsCollection.insertOne(newCV)

    return NextResponse.json({
      cv: {
        ...newCV,
        _id: result.insertedId.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Create CV error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

