const express = require('express');

const router = express.Router();

module.exports = function (params) {
  let { speakerService } = params;

  router.get('/', async function (request, response, next) {
    try {
      let speakers = await speakerService.getList();
      let artwork = await speakerService.getAllArtwork();
      return response.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers',
        speakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:shortname', async function (request, response, next) {
    try {
      let artwork = await speakerService.getArtworkForSpeaker(request.params.shortname);
      let speaker = await speakerService.getSpeaker(request.params.shortname);
      return response.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers-detail',
        speaker,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
    console.log(artwork);
  });

  return router;
};
