import clientPromise from "./mongodb";

// User model functions
export async function createUser(userData) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("users").insertOne(userData);
}

export async function findUserByEmail(email) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("users").findOne({ email });
}

export async function findUserById(id) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("users").findOne({ _id: id });
}

// CV model functions
export async function createCV(cvData) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("cvs").insertOne(cvData);
}

export async function updateCV(id, cvData) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("cvs").updateOne({ _id: id }, { $set: cvData });
}

export async function findCVByUserId(userId) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("cvs").findOne({ userId });
}

export async function findCVById(id) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("cvs").findOne({ _id: id });
}
