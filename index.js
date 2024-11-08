const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://assingment-frontend-six.vercel.app",
    // Add more origins as needed
  ],
  credentials: true,
};
app.use(cors(corsOptions));

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.e5lcf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnect = async () => {
  try {
    client.connect();
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

const Database = client.db("FromDb");
const usersCollection = Database.collection("users");

app.post("/users", async (req, res) => {
  const user = req.body;
  const result = await usersCollection.insertOne(user);
  res.send(result);
});

app.get("/users", async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await usersCollection.findOne(filter);
  res.send(result);
});

app.put("/updateusers/:id", async (req, res) => {
  const id = req.params.id;
  let user = req.body;

  if (user._id) {
    delete user._id;
  }

  const filter = { _id: new ObjectId(id) };

  const result = await usersCollection.updateOne(filter, { $set: user });

  res.send(result);
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await usersCollection.deleteOne(filter);
  res.send(result);
});

app.patch("/statususers/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const filter = { _id: new ObjectId(id) };
  const updateDoc = { $set: { status: status } };

  try {
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    console.error("Error updating user status", error);
    res.status(500).send({ message: "Failed to update user status" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
