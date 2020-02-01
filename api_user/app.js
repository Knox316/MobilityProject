require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./src/Routes/userRoute');
require('./src/Models/UserModel');
const app = express();
const port = process.env.PORT || 8000;
const server = require('http').Server(app);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
server.listen(process.env.PORT, () => {
  console.log('App is running on port ' + process.env.PORT);
});

const jwt = require('express-jwt');
const auth = jwt({
  secret: 'esteEoSegredo',
  userProperty: 'payload'
});

//BD SETUP
const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-krbnl.mongodb.net/MobilityProject?retryWrites=true&w=majority`;

mongoose.Promise = global.Promise;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .catch(err => console.log(err));

mongoose.connection
  .on('error', error => console.log('Error connecting to MongoLab:', error))
  .once('open', () => {
    console.log('Connected to MongoLab instance.');
  });

userRouter(app);

module.exports = app;


const expressSwagger = require('express-swagger-generator')(app);

//SWAGGER
let options = {
  swaggerDefinition: {
    info: {
      description: 'This is swagger documentation for Mobility Project',
      title: 'Swagger',
      version: '1.0.0'
    },
    host: '',
    basePath: '/api/v1/',
    produces: ['application/json', 'application/xml'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: ''
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: ['./src/Routes/**.js', './src/Models/**.js'] //Path to the API handle folder
};

expressSwagger(options);
app.listen(process.env.SWAGGER_PORT, () => {
  console.log('SWAGGER is running on port ' + process.env.SWAGGER_PORT);
});