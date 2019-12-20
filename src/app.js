require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const clientRouter = require('../api/Routes/clientRoute');
const vehicleRouter = require('../api/Routes/vehicleRoute');
const placeRouter = require('../api/Routes/placeRouter');
const authRouter = require('../api/Routes/authenticationRoute');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('../api/Models/ClientModel');
require('../api/Models/RentalModel');
require('../api/Models/VehicleModel');
require('../api/Models/PlaceModel');
require('../api/Models/UserModel');

const app = express();
const port = process.env.PORT || 8000;

const server = require('http').Server(app);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, () => {
  console.log('App is running on port ' + port);
});

//BD SETUP
const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-krbnl.mongodb.net/MobilityProject?retryWrites=true&w=majority`;
//const MONGO_URI = 'mongodb://localhost:27017/MobilityProject';

//mongoose.connect('mongodb://localhost/Mobility');

mongoose.Promise = global.Promise;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch(err => console.log(err));
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));
clientRouter(app);
vehicleRouter(app);
placeRouter(app);
authRouter(app);
app.use('/', indexRouter);

module.exports = app;
