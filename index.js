const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
// const port = process.env.PORT || 5000;
const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i4wg8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("disneyResorts");
    const resortCollection = database.collection("resorts");
    const bookedResortsCollection = database.collection("bookedResorts");

    // POST API add resort to database
    app.post("/addResorts", async (req, res) => {
      const resort = req.body;
      const result = await resortCollection.insertOne(resort);
      res.json(result);
    });

    // GET API get all Resorts
    app.get("/allResorts", async (req, res) => {
      const cursor = resortCollection.find({});
      const resorts = await cursor.toArray();
      res.json(resorts);
    });

    // DELETE API delete resort

    app.delete("/deleteResort/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await resortCollection.deleteOne(query);

      res.json(result);
    });

    // POST API  add   resort booking

    app.post("/addBooking", async (req, res) => {
      const booking = req.body;
      const result = await bookedResortsCollection.insertOne(booking);

      res.json(result);
    });

    // GET API get all Booking resorts
    app.get("/manageAllBookings", async (req, res) => {
      const cursor = bookedResortsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // DELETE API   delete booking
    app.delete("/deleteBooking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookedResortsCollection.deleteOne(query);

      res.json(result);
    });

    // GET API get only my booking  result
    app.get("/myBookings/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await bookedResortsCollection.find(query).toArray();
      res.json(result);
    });

    //UPDATE API Approve Booking
    app.put("/approveBooking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const Booking = {
        $set: {
          status: "Approved",
        },
      };
      const result = await bookedResortsCollection.updateOne(query, Booking);
      res.json(result);
    });
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
