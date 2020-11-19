const BotDetector = require('device-detector-js/dist/parsers/bot');

module.exports = async (req, _, next) => {
  let userAgent = req.get('user-agent');
  let detector = new BotDetector();
  let bot = detector.parse(userAgent);

  if (bot) {
    return next({
      status: 403,
      errors: [
        {
          msg: 'Forbidden',
        },
      ],
    });
  }

  return next();
};
