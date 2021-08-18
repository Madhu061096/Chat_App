const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
//const socket = require("socket.io");
const users = require("./routes/api/users");
const messages = require("./routes/api/messages");

const app = express();

// Port that the webserver listens to
const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

const http = require('http').Server(app);
//const io = socket(server);
const io = require('socket.io')(http).listen(server, { origins: '*:*' });
//io.on('connection', function(socket) {

  //  console.log('Client connected.');

    // Disconnect listener
    //socket.on('disconnect', function() {
      //  console.log('Client disconnected.');
    //});
//});

//const io = require("socket.io")().listen(server, { origins: '*:*' });

// Body Parser middleware to parse request bodies
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Database configuration
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Assign socket object to every request
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// Routes
app.use("/api/users", users);
app.use("/api/messages", messages);