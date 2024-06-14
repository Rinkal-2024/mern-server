const express = require('express');
const app = express();
const port = process.env.port || 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json())

app.get('/' ,(req,res)=>{
    res.send("hello")
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mern-book-store:Gb7rDqlH1YyZPWgG@cluster0.jctguec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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


   
    //create collection of document
    const bookCollection =  client.db("mern-book-store").collection("books");

    // insert a book to the db : post method 
    app.post('/upload-book' ,async(req,res)=>{
        const data = req.body;
        const result = await bookCollection.insertOne(data);
        res.send(result);
    })

    app.get('/all-books' , async(req,res)=>{
      const books = bookCollection.find();
      const result = await books.toArray();
      res.send(result)  
    })
      
    //update a book data : patch or update method 
    app.patch('/book/:id' , async(req,res)=>{
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = {_id : new ObjectId(id)}
      
      const updateDoc = {
        $set :{
          ...updateBookData
        }
      }
      const options = { upsert: true }; 
      const result = await bookCollection.updateOne(filter,updateDoc,options);
      res.send(result)
    })

    app.delete('/book/:id' ,async(req,res) =>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const result = await bookCollection.deleteOne(filter);
      res.send(result); 
    })

    // app.get('/all-books' ,async(req,res)=>{
    //   let query = {}
    //   if(req.query?.category){
    //     query = {category : req.query.category}
    //   }
    //   const result = await bookCollection.find(query).toArray();
    //   console.log(result);
    //   res.send(result);
    // })

    app.get("/all-books", async (req, res) => {
      let query = {};
      if (req.query?.category) {
          query = { category: req.query.category }
      }
      const result = await bookCollection.find(query).toArray();
      res.send(result)
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



app.listen(port ,()=>{
    console.log("your website is served on http://localhost:"+port);
})