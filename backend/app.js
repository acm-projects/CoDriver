const express = require('express');

const app = express();

// access data from frontend use request
// send data to frontend use response  
app.get('/', (req, res) => {
    res.send('<h1 style = "color: red;">Hello World</h1>');
})

app.listen(800, () => {
    console.log('port is listening');

})