const path = require('path');
const fs = require('fs');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');


function test() {

  logger.info('Enter test');

  return new Promise(function(resolve, reject) {
    SFClient.deRow.get((err, res) => {
      if (err) {

        logger.info('Get err');

        logger.error(err.message);

        reject(err);
      } else {
  
        logger.info('Get result');
        
        let retVal = '';
        for (const result of res.body.Results) {
          for (const property of result.Properties.Property) {
            logger.info(property);

            if (property.Name == 'DropDownJSON') {

              let retVal = property.value;
  //            configTemplate2 = configTemplate.replace('%%COMMSCONFIG%%' , property.value);

            }
            if (property.Name == 'ImageJSON') {

    //          configTemplate3 = configTemplate2.replace('%%IMAGECONFIG%%' , property.value);

            }
          }
        }

        logger.info('Resolve');

        resolve(retVal);
      }
    });
	});

}

async function callTest() {

  logger.info('callTest');

  try {
		let dataFirst = await test();

    logger.info('Called test');

		logger.info(dataFirst);

    return dataFirst;

	} catch (error) {
    logger.info('Error test');
		logger.info(error);
	}

}
/**
 * Render Config
 * @param req
 * @param res
 */
exports.config = (req, res) => {
  const domain = req.headers.host || req.headers.origin;
  const file = path.join(__dirname, '..', 'public', 'config-template.json');

  const configTemplate = fs.readFileSync(file, 'utf-8');
  let configTemplate2;
  let configTemplate3;

  logger.info(configTemplate);

  logger.info('Calling test');

  let testVal = callTest();

  logger.info('Got testVal');

  logger.info(testVal);

  const config = JSON.parse(configTemplate.replace(/\$DOMAIN/g, domain));

  res.json(config);
/*  try {
    SFClient.deRow.get((err, res) => {
      if (err) {

        logger.info('Get err');

        logger.error(err.message);
      } else {
  
        logger.info('Get result');
          
        for (const result of res.body.Results) {
          for (const property of result.Properties.Property) {
            logger.info(property);

            if (property.Name == 'DropDownJSON') {

              configTemplate2 = configTemplate.replace('%%COMMSCONFIG%%' , property.value);

            }
            if (property.Name == 'ImageJSON') {

              configTemplate3 = configTemplate2.replace('%%IMAGECONFIG%%' , property.value);

            }
          }
        }
      }
    });
} catch (error) {

  logger.info('Get error');

  logger.error(error);  
} */

};

/**
 * Render UI
 * @param req
 * @param res
 */
exports.ui = (req, res) => {
  res.render('index', {
    title: 'API Demo Connect',
    dropdownOptions: [
      {
        name: 'Select Vendor',
        value: 'Select Vendor',
      },
/*      {
        name: 'Edipost',
        value: 'Edipost',
      },
      {
        name: 'ONG Conseil',
        value: 'ONG Conseil',
      },
      {
        name: 'Call to Action',
        value: 'Call to Action',
      },
      {
        name: 'Voxens',
        value: 'Voxens',
      },*/
    ],
    dropdownCommunications: [
      {
        name: 'Select Communication',
        value: 'Select Communication',
      },
    ],
  });
};
