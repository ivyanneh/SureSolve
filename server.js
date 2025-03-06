import express from 'express';
import bodyParser from 'body-parser'
import userRoutes from './routes/users.js'
import './db.js' 
const app = express();

const PORT = 5000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log('[GET ROUTE]');
    res.send('HELLO FROM HOMEPAGE');
})
app.use('/users', userRoutes);
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));