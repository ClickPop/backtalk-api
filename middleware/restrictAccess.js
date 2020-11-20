const DeviceDetector = require('device-detector-js');

module.exports = async (req, _, next) => {
  let userAgent = req.get('user-agent');
  let detector = new DeviceDetector();
  let bot = detector.botParser.parse(userAgent);

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
