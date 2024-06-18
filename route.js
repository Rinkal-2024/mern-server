// const Router = require('express')
// const router = Router();

// // insert a book to db: Post Method
// router.post("/upload-book", async (req, res) => {
//     const data = req.body;
//     const result = await bookCollection.insertOne(data);
//     res.send(result);
// })
// // get all books & find by a category from db
// router.get("/all-books", async (req, res) => {
//     let query = {};
//     if (req.query?.category) {
//         query = { category: req.query.category }
//     }
//     const result = await bookCollection.find(query).toArray();
//     res.send(result)
// })
// // update a books method
// router.patch("/book/:id", async (req, res) => {
//     const id = req.params.id;
//     // console.log(id);
//     const updateBookData = req.body;
//     const filter = { _id: new ObjectId(id) };
//     const updatedDoc = {
//         $set: {
//             ...updateBookData
//         }
//     }
//     const options = { upsert: true };

//     // update now
//     const result = await bookCollection.updateOne(filter, updatedDoc, options);
//     res.send(result);
// })

// // delete a item from db
// router.delete("/book/:id", async (req, res) => {
//     const id = req.params.id;
//     const filter = { _id: new ObjectId(id) };
//     const result = await bookCollection.deleteOne(filter);
//     res.send(result);
// })

// // get a single book data
// router.get("/book/:id", async (req, res) => {
//     const id = req.params.id;
//     const filter = { _id: new ObjectId(id) };
//     const result = await bookCollection.findOne(filter);
//     res.send(result)
// })

// export default router