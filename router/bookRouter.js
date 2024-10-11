const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const bookRouter = express.Router();
const uri = process.env.MONGODB_URL; // Make sure your MongoDB URI is set

const client = new MongoClient(uri, {
});

// Connect to MongoDB and set up routes
async function run() {
    try {
        await client.connect();
        const bookCollection = client.db("mern-book-store").collection("books");

        // Insert a book to db: Post Method
        bookRouter.post("/upload-book", async (req, res) => {
            try {
                console.log(req.body)            
                const data = req.body;
                const result = await bookCollection.insertOne(data);
                res.status(201).send(result);
            } catch (error) {
                console.error('Error inserting book:', error);
                res.status(500).send({ error: 'Failed to insert book' });
            }
        });

        // Get all books & find by category
        bookRouter.get("/all-books", async (req, res) => {
            console.log("Received request for all books");
            try {
                let query = {};
                if (req.query?.category) {
                    query = { category: req.query.category };
                }
                const result = await bookCollection.find(query).toArray();
                res.send(result);
                console.log("Fetched books:", result);
            } catch (error) {
                console.error('Error fetching books:', error);
                res.status(500).send({ error: 'Failed to fetch books' });
                console.log("error" ,error)
            }
        });

        // Update a book method
        bookRouter.patch("/book/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const updateBookData = req.body;
                const filter = { _id: new ObjectId(id) };
                const updatedDoc = { $set: { ...updateBookData } };
                const options = { upsert: true };

                const result = await bookCollection.updateOne(filter, updatedDoc, options);
                res.send(result);
            } catch (error) {
                console.error('Error updating book:', error);
                res.status(500).send({ error: 'Failed to update book' });
            }
        });

        // Delete an item from db
        bookRouter.delete("/book/:id", async (req, res) => {
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
        bookRouter.get("/book/:id", async (req, res) => {
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
        bookRouter.get('/test', (req, res) => {
            res.send('Test route working!');
        });

        // Ping MongoDB to check the connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

run().catch(console.dir);

module.exports = bookRouter;
