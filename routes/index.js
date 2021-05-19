const express = require('express');

let speakersRoute = require('./speakers');
let feedbackRoute = require('./feedback');

let router = express.Router();

module.exports = function (params) {
  let { speakerService } = params;

  router.get('/', async function (request, response, next) {
    try {
      let artwork = await speakerService.getAllArtwork();
      let topSpeakers = await speakerService.getList();
      return response.render('layout', {
        pageTitle: 'Home',
        template: 'index',
        topSpeakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
    // console.log(topSpeakers);
    //testing if cookies are able to count each time page is loaded
    // if (!request.session.visitCount) {
    //   request.session.visitCount = 0;
    // }
    // request.session.visitCount += 1;
    // console.log(`Number of visits ${request.session.visitCount}`);
    //getting the index to display as home
  });

  router.use('/speakers', speakersRoute(params));
  router.use('/feedback', feedbackRoute(params));
  return router;
};
