const express = require('express');

let { check, validationResult } = require('express-validator');

let router = express.Router();

module.exports = function (params) {
  let { feedbackService } = params;

  router.get('/', async function (request, response, next) {
    try {
      let feedback = await feedbackService.getList();


      let errors = request.session.feedback ? request.session.feedback.errors : false;
      request.session.feedback = {};//request the session object

      return response.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
        errors
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post(
    '/',
    [
      check('name') //check the name
        .trim() //remove empty characters
        .isLength({ min: 30 }) //ensure the length is at least 3 characters long
        .escape() //no html and js embedded in this entry
        .withMessage('A name is required'),
      check('email') //check the name
        .trim() //remove empty characters
        .isEmail() //ensure that item is email address
        .normalizeEmail() //make email lowercase
        .escape() //no html and js embedded in this entry
        .withMessage('Email address is required'),
      check('title') //check the name
        .trim() //remove empty characters
        .isLength({ min: 2 }) //ensure the length is at least 2 characters long
        .escape() //no html and js embedded in this entry
        .withMessage('A title is required'),
      check('message') //check the name
        .trim() //remove empty characters
        .isLength({ min: 15 }) //ensure the length is at least 15 characters long
        .escape() //no html and js embedded in this entry
        .withMessage('A message is required'),
    ],
    function (request, response) {
      let errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.session.feedback = { errors: errors.array() };
        return response.redirect('feedback');
      }
      //console.log(request.body);
      return response.send('Feedback form posted');
    }
  );

  return router;
};
