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
      ipAddress: {
        type: DataTypes.INET,
        get() {
          const rawValue = this.getDataValue('ipAddress');
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
      },
      respondent: DataTypes.STRING,
      geo: {
        type: DataTypes.VIRTUAL,
        get() {
          let rVal = null;
          if (typeof this.ipAddress === 'object' && 'ipv4' in this.ipAddress) {
            rVal = geoip.lookup(this.ipAddress.ipv4);
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
