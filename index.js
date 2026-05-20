const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();

const app = express();
const cors = require('cors');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');
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



//for jwt:
const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));

const verifyToken = async (req, res, next) => {
    const authHeader = req?.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const { payload } = await jwtVerify(token, JWKS);
        console.log(payload);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden" });
    }
};



async function run() {
    try {
        await client.connect();


        const db = client.db("libra-room-db");
        const roomCollection = db.collection("rooms");
        const bookingCollection = db.collection("bookings");



        // app.get('/rooms', async (req, res) => {
        //     const result = await roomCollection.find().toArray();
        //     res.send(result);
        // });



        app.get("/rooms", async (req, res) => {
            const { search, floor, amenities } = req.query;

            let query = {};

            // 1. SEARCH (name + description)
            if (search) {
                query.$or = [
                    {
                        name: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        description: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                ];
            }

            // 2. FLOOR FILTER
            if (floor && floor !== "all") {
                query.floor = Number(floor);
            }

            // 3. AMENITIES FILTER (array match)
            if (amenities) {
                const amenitiesArray = amenities.split(",");

                query.amenities = {
                    $in: amenitiesArray,
                };
            }

            const result = await roomCollection.find(query).toArray();

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




        app.patch("/rooms/:roomId", verifyToken, async (req, res) => {
            const { roomId } = req.params;
            const updatedData = req.body;
            // console.log(updatedData);

            const result = await roomCollection.updateOne(
                { _id: new ObjectId(roomId) },
                { $set: updatedData },
            );

            res.json(result);
        });



        app.delete('/rooms/:roomId', verifyToken, async (req, res) => {
            const { roomId } = req.params;
            const result = await roomCollection.deleteOne({ _id: new ObjectId(roomId) });

            res.send(result);
        })



        app.get("/booking", async (req, res) => {
            const result = await bookingCollection.find().toArray();
            res.send(result);
        });



        // app.get("/booking", async (req, res) => {
        //     const userId = req.user?.sub;

        //     const result = await bookingCollection
        //         .find({ userId })
        //         .toArray();

        //     res.send(result);
        // });




        // app.post("/booking", async (req, res) => {
        //     const bookingData = req.body;
        //     const result = await bookingCollection.insertOne(bookingData);

        //     res.json(result);
        // });




        app.post("/booking", async (req, res) => {
            const bookingData = req.body;

            const { roomId, date, startTime, endTime, hourlyRate } = bookingData;

            const start = Number(startTime.split(":")[0]);
            const end = Number(endTime.split(":")[0]);

            if (start >= end) {
                return res.status(400).json({
                    message: "Invalid time range",
                });
            }

            const normalizedDate = new Date(date).toISOString().split("T")[0];

            const conflict = await bookingCollection.findOne({
                roomId,
                date: normalizedDate,
                $or: [
                    {
                        startHour: { $lt: end },
                        endHour: { $gt: start }
                    }
                ]
            });

            if (conflict) {
                return res.status(409).json({
                    message: "Time slot already booked",
                });
            }

            const rate = Number(hourlyRate || 0);
            const duration = end - start;
            const totalPrice = duration * rate;

            const newBooking = {
                ...bookingData,
                userId: req.user?.sub,
                date: normalizedDate,
                startHour: start,
                endHour: end,
                totalPrice,
                status: "confirmed",
                createdAt: new Date(),
            };

            const result = await bookingCollection.insertOne(newBooking);

            res.send(result);
        });



        app.patch("/booking/:bookingId", async (req, res) => {
            const { bookingId } = req.params;

            const result = await bookingCollection.updateOne(
                { _id: new ObjectId(bookingId) },
                {
                    $set: {
                        status: "cancelled",
                        cancelledAt: new Date(),
                    }
                }
            );

            res.send(result);
        });


        // app.delete("/booking/:bookingId", async (req, res) => {
        //     const { bookingId } = req.params;
        //     const result = await bookingCollection.deleteOne({
        //         _id: new ObjectId(bookingId),
        //     });

        //     res.json(result);
        // });







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


