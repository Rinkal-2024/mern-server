const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
const Router = require('express')
const router = Router();




router.get('/', (req, res) => {
    res.send('Hello World!')
})

// mongodb confiq here
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mern-book-store:DQy44OwFEGXTEeMT@cluster0.jctguec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const bookCollection = client.db("mern-book-store").collection("books");


        // insert a book to db: Post Method
        router.post("/upload-book", async (req, res) => {
            const data = req.body;
            const result = await bookCollection.insertOne(data);
            res.send(result);
        })

        // get all books from db
        // router.get("/all-books", async (req, res) => {
        //     const books = bookCollection.find();
        //     const result = await books.toArray();
        //     res.send(result)
        // })

        // get all books & find by a category from db
        router.get("/all-books", async (req, res) => {
            let query = {};
            if (req.query?.category) {
                query = { category: req.query.category }
            }
            console.log(query);
            const result = await bookCollection.find(query).toArray();
            res.send(result)
        })

        // update a books method
        router.patch("/book/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const updateBookData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    ...updateBookData
                }
            }
            const options = { upsert: true };

            // update now
            const result = await bookCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // delete a item from db
        router.delete("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollection.deleteOne(filter);
            res.send(result);
        })

        // get a single book data
        router.get("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollection.findOne(filter);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir ,"-->");

app.listen(port, () => {
    console.log(`you server is running on http://localhost:${port}`)
})