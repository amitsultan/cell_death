const express = require('express');
let app = express();
var cors = require("cors");
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
// Constants
const PORT = 8081;

// App
app.get('/test', (req, res) => {
  res.send('Msg from server');
});


app.listen(PORT);
console.log(`Running on PORT: ${PORT}`);