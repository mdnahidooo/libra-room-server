const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();

const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const uri = process.env.AUTH_DB_URI;


// middleware
app.use(cors());
app.use(express.json());




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        await client.connect();


        const db = client.db("libra-room-db");
        const roomCollection = db.collection("rooms");



        app.get('/rooms', async (req, res) => {
            const result = await roomCollection.find().toArray();
            res.send(result);
        });

        app.get('/rooms/:roomId', async (req, res) => {
            const { roomId } = req.params;
            const result = await roomCollection.findOne({ _id: new ObjectId(roomId) });
            res.send(result);
        });

        app.get("/featured", async (req, res) => {
            const result = await roomCollection.find().sort({ _id: -1 }).limit(6).toArray()
            res.json(result)
        })


        app.post('/rooms', async (req, res) => {
            const roomData = req.body;
            // console.log(roomData);
            const result = await roomCollection.insertOne(roomData);

            res.send(result);
        })




        app.patch("/rooms/:roomId", async (req, res) => {
            const { roomId } = req.params;
            const updatedData = req.body;
            // console.log(updatedData);

            const result = await roomCollection.updateOne(
                { _id: new ObjectId(roomId) },
                { $set: updatedData },
            );

            res.json(result);
        });



        app.delete('/rooms/:roomId', async (req, res) => {
            const { roomId } = req.params;
            const result = await roomCollection.deleteOne({ _id: new ObjectId(roomId) });
            
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('Hello World! My server is running...')
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})