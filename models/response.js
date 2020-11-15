'use strict';
const { Model } = require('sequelize');
const geoip = require('geoip-lite');
const ip6addr = require('ip6addr');

module.exports = (sequelize, DataTypes) => {
  class Response extends Model {}

  Response.init(
    {
      data: DataTypes.JSONB,
      userAgent: DataTypes.STRING,
      ipAddress: DataTypes.INET,
      respondent: DataTypes.STRING,
      ipAddressFormatted: {
        type: DataTypes.VIRTUAL,
        get() {
          const rawValue = this.ipAddress;
          let tempIP = ip6addr.parse(rawValue);
          let ipv4 = tempIP.toString({ format: 'v4' });
          let ipv6 = tempIP.toString({ format: 'v6' });
          let returnValue = { raw: rawValue };
          if (ipv4) {
            returnValue.ipv4 = ipv4;
          }
          if (ipv6) {
            returnValue.ipv6 = ipv6;
          }
          return returnValue;
        },
        set(value) {
          throw new Error(
            `Cannot explicitly set the \`ipAddressFormatted\` property. Value: \`${value}\` rejected.`,
          );
        },
      },
      geo: {
        type: DataTypes.VIRTUAL,
        get() {
          let rVal = null;
          if (
            typeof this.ipAddressFormatted === 'object' &&
            'ipv4' in this.ipAddressFormatted
          ) {
            rVal = geoip.lookup(this.ipAddressFormatted.ipv4);
          }
          return rVal;
        },
        set(value) {
          throw new Error(
            `Cannot explicitly set the \`geo\` property. Value: \`${value}\` rejected.`,
          );
        },
      },
    },
    {
      sequelize,
    },
  );

  Response.associate = function (models) {
    Response.belongsTo(models.Survey);
  };

  return Response;
};
