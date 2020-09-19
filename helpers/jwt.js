require('dotenv').config();
const { sign, verify } = require('jsonwebtoken');

const getAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    sign(
      { user: { id: userId } },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '5m',
      },
      (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      },
    );
  });
};

const getRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    sign(
      { user: { id: userId } },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      },
      (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      },
    );
  });
};

const checkAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};

const checkRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};

module.exports = {
  getAccessToken,
  getRefreshToken,
  checkAccessToken,
  checkRefreshToken,
};
