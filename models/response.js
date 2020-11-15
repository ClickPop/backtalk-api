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
          let returnValue = null;
          if (this.ipAddress) {
            let rawIP = this.ipAddress;
            let tempIP = ip6addr.parse(rawIP);
            let ipv4 = tempIP.toString({ format: 'v4' });
            let ipv6 = tempIP.toString({ format: 'v6' });
            returnValue = { raw: rawIP };
            if (ipv4) {
              returnValue.ipv4 = ipv4;
            }
            if (ipv6) {
              returnValue.ipv6 = ipv6;
            }
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
            this.ipAddressFormatted !== null &&
            typeof this.ipAddressFormatted === 'object' &&
            'ipv4' in this.ipAddressFormatted
          ) {
            rVal = geoip.lookup(this.ipAddressFormatted.ipv4);

            if (rVal === null || rVal === undefined) {
              let cidr1 = ip6addr.createCIDR('10.0.0.0', 8);
              let cidr2 = ip6addr.createCIDR('172.16.0.0', 12);
              let cidr3 = ip6addr.createCIDR('192.168.0.0', 16);
              let ipv4 = this.ipAddressFormatted.ipv4;

              if ('127.0.0.1' === ipv4) {
                rVal = { type: 'localhost' };
              } else if (
                cidr1.contains(ipv4) ||
                cidr2.contains(ipv4) ||
                cidr3.contains(ipv4)
              ) {
                rVal = { type: 'private' };
              } else {
                rVal = { type: 'unknown' };
              }
            } else if (typeof rVal === 'object' && rVal !== null) {
              rVal.type = 'location';
            }
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
