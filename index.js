const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
const router = express.Router();

app.use(cors({
    credentials: 'include',
    origin: 'https://mern-client-three.vercel.app',    
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// MongoDB config here
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI || "mongodb+srv://mern-book-store:DQy44OwFEGXTEeMT@cluster0.jctguec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        const bookCollection = client.db("mern-book-store").collection("books");

        // Insert a book to db: Post Method
        router.post("/upload-book", async (req, res) => {
            try {
                const data = req.body;
                const result = await bookCollection.insertOne(data);
                res.send(result);
            } catch (error) {
                console.error('Error inserting book:', error);
                res.status(500).send({ error: 'Failed to insert book' });
            }
        });

        // Get all books & find by a category from db
        router.get("/all-books", async (req, res) => {
            try {
                let query = {};
                if (req.query?.category) {
                    query = { category: req.query.category };
                }
                console.log(query);
                const result = await bookCollection.find(query).toArray();
                res.send(result);
            } catch (error) {
                console.error('Error fetching books:', error);
                res.status(500).send({ error: 'Failed to fetch books' });
            }
        });

        // Update a book method
        router.patch("/book/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const updateBookData = req.body;
                const filter = { _id: new ObjectId(id) };
                const updatedDoc = {
                    $set: { ...updateBookData }
                };
                const options = { upsert: true };

                const result = await bookCollection.updateOne(filter, updatedDoc, options);
                res.send(result);
            } catch (error) {
                console.error('Error updating book:', error);
                res.status(500).send({ error: 'Failed to update book' });
            }
        });

        // Delete an item from db
        router.delete("/book/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const result = await bookCollection.deleteOne(filter);
                res.send(result);
            } catch (error) {
                console.error('Error deleting book:', error);
                res.status(500).send({ error: 'Failed to delete book' });
            }
        });

        // Get a single book data
        router.get("/book/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const result = await bookCollection.findOne(filter);
                res.send(result);
            } catch (error) {
                console.error('Error fetching book:', error);
                res.status(500).send({ error: 'Failed to fetch book' });
            }
        });

        // Test route
        router.get('/test', (req, res) => {
            res.send('Test route working!');
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// Attach the router to the app with a base path
app.use('/', router);

app.listen(port, () => {
    console.log(`Your server is running on http://localhost:${port}`);
});
