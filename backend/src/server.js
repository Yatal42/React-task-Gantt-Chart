require('dotenv').config();

const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json()); 

app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});