const express = require('express');
const router = express.Router();
const {
  checkValidationResult,
  checkTitle,
} = require('../../middleware/validation');

const { Survey } = require('../../models');

router.post(
  '/new',
  [checkTitle],
  checkValidationResult,
  async (req, res, next) => {
    try {
      let mapped = {
        title: req.body.title,
        description: req.body.description || null,
      };

      const survey = await Survey.create({
        ...mapped,
      });

      return res.json({
        created: true,
        survey,
      });
    } catch (err) {
      next({
        status: 500,
        stack: err,
        errors: [
          {
            msg: err.msg,
          },
        ],
      });
    }
  },
);

module.exports = router;
