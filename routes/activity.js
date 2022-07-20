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
//  logger.info(JSON.stringify(data));

  const uid = Uuidv1();

  try {
    let method;

    logger.info('data.inArguments - ' + JSON.stringify(data.inArguments));
//    logger.info('data.inArguments[0] - ' + JSON.stringify(data.inArguments[0]));

//    logger.info('contactIdentifier - <' + data.inArguments[0].contactIdentifier + '>');
//    logger.info('DropdownOptions - <' + data.inArguments[4].DropdownOptions + '>');
//    logger.info('DropdownCommunications - <' + data.inArguments[5].DropdownCommunications + '>');
//    logger.info('APIMethod - <' + data.inArguments[6].APIMethod + '>');
//    logger.info('FTPMethod - <' + data.inArguments[7].FTPMethod + '>');
      logger.info('TCode - <' + data.inArguments[8].TCode + '>');
      logger.info('Other - <' + data.inArguments[9].Other + '>');

//    logger.info('method equal ' + (data.inArguments[6].APIMethod == 'on'));


    if (data.inArguments[6].APIMethod == 'on') {
      method = 'API';
    } else {
      method = 'FTP';
    }

    var id = data.inArguments[0].contactIdentifier;

    logger.info('method - ' + method);

    if (method == 'API') {

      axios.post(process.env.API_URL, {
        contactEmail: id,
        vendor: data.inArguments[4].DropdownOptions,
        communication :data.inArguments[5].DropdownCommunications
  
      })
      .then(function (response) {
        logger.info(response);
    
      })
      .catch(function (error) {
        logger.error(error);
      });
  
    }
    else {

      logger.info('Insert into log');

      let pData = {
        uri: `/hub/v1/dataevents/key:${process.env.LOGGING_DATA_EXTENSION}/rowset`,
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
        body: [
          {
            keys: {
              DirectMailId: uid,
            },
            values: {
              Id: id,
              Vendor: data.inArguments[4].DropdownOptions,
              Communication: data.inArguments[5].DropdownCommunications,
              TrackingCode: data.inArguments[8].TCode,
              OtherInformation: data.inArguments[9].Other,
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
    }

 

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
