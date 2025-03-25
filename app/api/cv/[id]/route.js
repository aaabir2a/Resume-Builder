import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request, context) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In Next.js 15, params is a Promise that needs to be awaited
    const params = await context.params;
    const id = params.id;

    const client = await clientPromise;
    const db = client.db();
    const cvsCollection = db.collection("cvs");

    const cv = await cvsCollection.findOne({
      _id: new ObjectId(id),
      userId: user._id,
    });

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    return NextResponse.json({ cv });
  } catch (error) {
    console.error("Get CV error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In Next.js 15, params is a Promise that needs to be awaited
    const params = await context.params;
    const id = params.id;

    const cvData = await request.json();

    const client = await clientPromise;
    const db = client.db();
    const cvsCollection = db.collection("cvs");

    // Check if CV exists and belongs to user
    const existingCV = await cvsCollection.findOne({
      _id: new ObjectId(id),
      userId: user._id,
    });

    if (!existingCV) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    const now = new Date();

    // Create a new object without the _id field to avoid the immutable field error
    const { _id, ...cvDataWithoutId } = cvData;

    const updatedCV = {
      ...cvDataWithoutId,
      userId: user._id,
      lastUpdated: now,
    };

    await cvsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedCV }
    );

    return NextResponse.json({
      cv: {
        ...updatedCV,
        _id: id,
      },
    });
  } catch (error) {
    console.error("Update CV error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In Next.js 15, params is a Promise that needs to be awaited
    const params = await context.params;
    const id = params.id;

    const client = await clientPromise;
    const db = client.db();
    const cvsCollection = db.collection("cvs");

    // Check if CV exists and belongs to user
    const existingCV = await cvsCollection.findOne({
      _id: new ObjectId(id),
      userId: user._id,
    });

    if (!existingCV) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    await cvsCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete CV error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
