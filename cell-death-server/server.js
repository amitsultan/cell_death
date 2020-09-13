const express = require('express');
let app = express();
var cors = require("cors");
const corsConfig = {
  origin: true,
  credentials: true,
};

//routes import 
const auth = require("./routes/auth");

var port = process.env.PORT;

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(auth)

// App
app.get('/test', (req, res) => {
  res.send('Msg from server');
});


app.listen(port);
console.log(`Running on PORT: ${port}`);