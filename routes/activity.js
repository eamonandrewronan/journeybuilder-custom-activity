const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');
var jsforce = require('jsforce');
const FuelRest = require('fuel-rest');

const axios = require('axios').default;
const { v1: Uuidv1 } = require('uuid');

const options = {
  auth: {
    clientId: process.env.SFMC_CLIENT_ID,
    clientSecret: process.env.SFMC_CLIENT_SECRET,
    authOptions: {
      authVersion: 2,
      accountId: process.env.SFMC_ACCOUNT_ID,
    },
    authUrl: `https://${process.env.SFMC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/token`,
  },
  origin: `https://${process.env.SFMC_SUBDOMAIN}.rest.marketingcloudapis.com/`,
  globalReqOptions: {
  },
};

const client = new FuelRest(options);

/**
 * The Journey Builder calls this method for each contact processed by the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.execute = async (req, res) => {
  // decode data
  const data = JWT(req.body);

  logger.info('execute');

  const uid = Uuidv1();

  try {

    logger.info('data.inArguments - ' + JSON.stringify(data.inArguments));
 
    var id = data.inArguments[0].contactIdentifier;
    var typeVal;
    var vendorVal;
    var commsVal;
    var tcVal;
    var oVal;
    var oppId;
    var campaignId;

    for (var i = 0, l = data.inArguments.length; i < l; i++) {
      var obj = data.inArguments[i];

      var key = Object.keys(obj)[0];
      var value = obj[key];

      if (key == 'TCode') {
        tcVal = value;
      }
      else if (key == 'Other') {
        oVal = value;
      }
      else if (key == 'DropdownCommunications') {
        commsVal = value;
      }
      else if (key == 'DropdownOptions') {
        vendorVal = value;
      }
      else if (key == 'TypeOptions') {
        typeVal = value;
      }
      else if (key == 'CampaignID') {
        campaignId = value;
      }
      else if (key == 'OpportunityID') {
        oppId = value;
      }

      logger.info('index - ' + i);
      logger.info('entry - ' + JSON.stringify(obj));
      
      // ...
    }

    logger.info('Insert into log');

    var todayDt = new Date();

    let pData = {
      uri: `/hub/v1/dataevents/key:${process.env.LOGGING_DATA_EXTENSION}/rowset`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      body: [
        {
          keys: {
            OfflineActivityId: uid,
          },
          values: {
            Id: id,
            Type: typeVal,
            Vendor: vendorVal,
            Communication: commsVal,
            TrackingCode: tcVal,
            OtherInformation: oVal,
            Status: 'Added',         
            AddedDate: todayDt,          
            OpportunityID: oppId,         
            CampaignID: campaignId,         
           },
        },
      ] };

      logger.info('pDatata - ' + JSON.stringify(pData));

      client.post( pData, (err, res) => {
        if (err) {
  
          logger.info('Get err');
  
          logger.error(err);
  
        } else {
    
          logger.info('Get result');
          logger.info('res - ' + JSON.stringify(res));

        }
      });
    

 

  } catch (error) {


    logger.error(error);
  }

  res.status(200).send({
    status: 'ok',
  });
};


/**
 * Endpoint that receives a notification when a user saves the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.save = async (req, res) => {

  logger.info('save');

  logger.info(JSON.stringify(req.body));

  res.status(200).send({
    status: 'ok',
  });
};

/**
 *  Endpoint that receives a notification when a user publishes the journey.
 * @param req
 * @param res
 */
exports.publish = (req, res) => {

  logger.info('publish');

  logger.info(JSON.stringify(req.body));

  res.status(200).send({
    status: 'ok',
  });
};

/**
 * Endpoint that receives a notification when a user performs
 * some validation as part of the publishing process.
 * @param req
 * @param res
 */
exports.validate = (req, res) => {

  logger.info('validate');

  res.status(200).send({
    status: 'ok',
  });
};
