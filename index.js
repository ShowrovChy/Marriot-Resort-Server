const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i4wg8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    console.log("working");
    await client.connect();
    const database = client.db("disneyResorts");
    const resortCollection = database.collection("resorts");
    // const bookedResortsCollection = database.collection("bookedResorts");

    // POST API add resort to database
    app.post("/addResorts", async (req, res) => {
      const resort = req.body;
      console.log(resort);
      const result = await resortCollection.insertOne(resort);
      res.json(result);
    });

    // GET API get all Resorts
    app.get("/allResorts", async (req, res) => {
      const cursor = resortCollection.find({});
      const resorts = await cursor.toArray();
      res.json(resorts);
    });
    // GET API get single event
    /*    app.get("/singleEvents/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = {
        projection: { _id: 0 },
      };
      const result = await eventCollection.findOne(query, options);
      res.json(result);
    }); */

    // POST API  get Booked Resorts

    /*    app.post("/joinedEvents/:id", async (req, res) => {
      const addedEvent = req.body;
      console.log(addedEvent);
      const joinedEvent = await joinedEventsCollection.insertOne(addedEvent);
      res.json(joinedEvent);
    }); */

    // Delete API delete event
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Disney Resort  Server is Running");
});
app.listen(port, () => {
  console.log("listening to the port ", port);
});
