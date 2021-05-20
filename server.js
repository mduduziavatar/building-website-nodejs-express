let express = require('express');
let path = require('path');
let cookieSession = require('cookie-session');
let createError = require('http-errors');
let bodyParser = require('body-parser');

let FeedbackService = require('./services/FeedbackService');
let SpeakerService = require('./services/SpeakerService');

let feedbackService = new FeedbackService('./data/feedback.json');
let speakerService = new SpeakerService('./data/speakers.json');

let app = express();

let routes = require('./routes');
const { request, response } = require('express');

//for reverse proxy to be able to track app
app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['Randomly', 'Created'],
  })
);

app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';
app.use(express.static(path.join(__dirname, './static')));

app.use(async function (request, response, next) {
  try {
    let names = await speakerService.getNames();
    response.locals.speakerNames = names; //object has properties that are local variables within the application.
    // console.log(response.locals);
    return next(); //never forget the return function when working middleware
  } catch (err) {
    return next(err);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    speakerService,
  })
);

app.use(function (request, response, next) {
  return next(createError(404, 'File not found'));
});

//this becomes middleware for errors just because it take four arguments 
app.use(function (err, request, response, next){
response.locals.message = err.message;
console.error(err);
let status = err.status || 500;
response.locals.status = status;
response.status(status);
response.render('error')
})

let port = 3000;
app.listen(port, function () {
  console.log(`Express server listening on port ${port}!`);
});
