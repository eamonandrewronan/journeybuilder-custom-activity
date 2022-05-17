const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');
var jsforce = require('jsforce');
const axios = require('axios').default;

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
  logger.info(JSON.stringify(data));

  try {
    let method;

    if (data.inArguments[0].APIMethod === 'on') {
      method = 'API';
    } else {
      method = 'FTP';
    }

    var id = data.inArguments[0].contactIdentifier;

    if (method == 'API') {

      axios.post(process.env.API_URL, {
        contactEmail: id,
        vendor: data.inArguments[0].DropdownOptions,
        communication :data.inArguments[0].DropdownCommunications
  
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  
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

    await SFClient.saveData(process.env.LOGGING_DATA_EXTENSION, [
      {
        keys: {
          SubscriberKey: data.inArguments[0].contactIdentifier,
        },
        values: {
          Message: ' - Updated from JB.' + 'Vendor: ' + data.inArguments[0].DropdownOptions + ', Communication: ' + data.inArguments[0].DropdownCommunications + ', Method: ' + method,
        },
      },
    ]);
  } catch (error) {

    await SFClient.saveData(process.env.LOGGING_DATA_EXTENSION, [
      {
        keys: {
          SubscriberKey: data.inArguments[0].contactIdentifier,
        },
        values: {
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
