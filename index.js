const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const userRoutes = require('./router/userRoute');
const bookRouter = require('./router/bookRouter');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors({
    credentials: 'include',
    origin: ['http://localhost:5173' ,'http://192.168.0.120:5173'],
}));

const uri = process.env.MONGODB_URL;

if (!uri) {
    throw new Error('MONGODB_URL is not defined in the environment variables');
}
mongoose.connect(uri, {  
})
.then(() => console.log("Connected to MongoDB!"))
.catch(err => console.error("MongoDB connection error:", err));


app.get('/' ,(req,res) =>{
    res.send('Welcome to the Bookstore API')
})
// Define your routes
app.use("/user", userRoutes);
app.use(bookRouter)

app.listen(port, () => {
    console.log(`Your server is running on http://localhost:${port}`);
});
