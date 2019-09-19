const express = require('express');

const port = 1337;

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the Fullstack Auth from Scratch backend!');
})

app.listen(port, () => console.log(`Server started listening on port ${port}!`))
