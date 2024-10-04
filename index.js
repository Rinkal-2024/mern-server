const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bookRouter = require('./bookRouter');
const port = process.env.PORT || 8000;
const app = express();

dotenv.config()

require('./dbConfig')()

//middlewares
app.use(express.json());
app.use(cors({
    credentials: 'include',
    origin:'',    
}));

app.use('/api' ,bookRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Your server is running on http://localhost:${port}`);
});