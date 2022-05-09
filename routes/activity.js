const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');
var jsforce = require('jsforce');

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

//    var id = data.inArguments[0].contactKey;

    var id = '00306000025YjA9AAK';

    var conn = new jsforce.Connection({
      // you can change loginUrl to connect to sandbox or prerelease env.
     loginUrl : 'https://login.salesforce.com'
    });
  
    conn.login('liam.collerton@gcdemo.org', 'dt#UnjEc2*CMck1!6#LDCO7eMuJicdnB9tzCCzYlq3Egly', function(err, res) {
      if (err) { return console.error(err); }
  

      var records = [];
      conn.query("SELECT Id FROM Contact where id ='" + id + "'", function(err, result) {
        if (err) { return console.error(err); }
        console.log("total : " + result.totalSize);
        console.log("fetched : " + result.records.length);
        console.log("done ? : " + result.done);

        var newId = result.records[0].id;

        // Single record update
        conn.sobject("Contact").update({ 
          Id : newId,
          Title : 'Lord'
        }, function(err, ret) {
          if (err || !ret.success) { return console.error(err, ret); }
          console.log('Updated Successfully : ' + ret.id);
          // ...
        });

      });

    });
  

    await SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY, [
      {
        keys: {
          SubscriberKey: data.inArguments[0].contactKey,
        },
        values: {
          Vendor: data.inArguments[0].DropdownOptions,
          Communication: data.inArguments[0].DropdownCommunications,
          Method: method,
        },
      },
    ]);
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

  var id = '00306000025YjA9AAK';

  var conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
   loginUrl : 'https://login.salesforce.com'
  });

  conn.login('liam.collerton@gcdemo.org', 'dt#UnjEc2*CMck1!6#LDCO7eMuJicdnB9tzCCzYlq3Egly', function(err, res) {
    if (err) { return console.error(err); }


    var records = [];
    conn.query("SELECT Id FROM Contact where id ='" + id + "'", function(err, result) {
      if (err) { return console.error(err); }
      console.log("total : " + result.totalSize);
      console.log("fetched : " + result.records.length);
      console.log("done ? : " + result.done);

      var newId = result.records[0].id;

      // Single record update
      conn.sobject("Contact").update({ 
        Id : newId,
        Title : 'Sir'
      }, function(err, ret) {
        if (err || !ret.success) { return console.error(err, ret); }
        console.log('Updated Successfully : ' + ret.id);
        // ...
      });

    });

  });

  res.status(200).send({
    status: 'ok',
  });
};
