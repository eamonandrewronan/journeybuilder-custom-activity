const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');
var jsforce = require('jsforce');
const axios = require('axios').default;
const { v1: Uuidv1 } = require('uuid');

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

//    logger.info('data.inArguments - ' + JSON.stringify(data.inArguments));
//    logger.info('data.inArguments[0] - ' + JSON.stringify(data.inArguments[0]));

//    logger.info('contactIdentifier - <' + data.inArguments[0].contactIdentifier + '>');
//    logger.info('DropdownOptions - <' + data.inArguments[4].DropdownOptions + '>');
//    logger.info('DropdownCommunications - <' + data.inArguments[5].DropdownCommunications + '>');
//    logger.info('APIMethod - <' + data.inArguments[6].APIMethod + '>');
//    logger.info('FTPMethod - <' + data.inArguments[7].FTPMethod + '>');

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

  /*      await SFClient.saveData(process.env.LOGGING_DATA_EXTENSION, [
          {
            keys: {
              UniqueId: uid,
            },
            values: {
              Contact: data.inArguments[0].contactIdentifier,
              Message: ' - Updated from JB.' + 'Vendor: ' + data.inArguments[4].DropdownOptions + ', Communication: ' + data.inArguments[5].DropdownCommunications + ', Method: ' + method,
            },
          },
        ]); */
    
      })
      .catch(function (error) {
        logger.error(error);
      });
  
    }
    else {

      logger.info('Insert into log');

      await SFClient.insertData(process.env.LOGGING_DATA_EXTENSION, 
        [
        {
          keys: {
            UniqueId: uid,
          },
          values: {
            Contact: data.inArguments[0].contactIdentifier,
            Message: 'FTP Request from JB.' + 'Vendor: ' + data.inArguments[4].DropdownOptions + ', Communication: ' + data.inArguments[5].DropdownCommunications + ', Method: ' + method,
          },
        },
      ]);
  
    }

    /*
    var apiUrl = process.env.API_URL;
    var apiUsername = process.env.API_USERNAME;
    var apiPassword = process.env.API_PASSWORD;

    var conn = new jsforce.Connection({
      // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : apiUrl
    });

    conn.login(apiUsername, apiPassword, function(err, res) {
      if (err) { return console.error(err); }

      conn.query("SELECT Id FROM Contact where Email ='" + id + "'", function(err, result) {
        if (err) { return console.error(err); }
        console.log("total : " + result.totalSize);
        console.log("fetched : " + result.records.length);
        console.log("done ? : " + result.done);

        console.log("fetched : " + JSON.stringify(result.records));

        var newId = result.records[0].Id;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var mins = today.getMinutes();
        var ss = today.getSeconds();

        today = mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + mins + ':' + ss;
        
        // Single record update
        conn.sobject("Contact").update({ 
          Id : newId,
          Description : today + ' - Updated from JB.' + 'Vendor: ' + data.inArguments[0].DropdownOptions + ', Communication: ' + data.inArguments[0].DropdownCommunications + ', Method: ' + method
        }, function(err, ret) {
          if (err || !ret.success) { return console.error(err, ret); }
          console.log('Updated Successfully : ' + ret.id);
          // ...
        });

      });

    }); */

  } catch (error) {

    await SFClient.insertData(process.env.LOGGING_DATA_EXTENSION, [
      {
        keys: {
          UniqueId: uid,
        },
        values: {
          Contact: data.inArguments[0].contactIdentifier,
          Message: error,
        },
      },
    ]);

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
