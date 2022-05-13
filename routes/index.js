const path = require('path');
const fs = require('fs');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');


async function test() {
	let promise = new Promise(function(resolve, reject) {
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

  //            configTemplate2 = configTemplate.replace('%%COMMSCONFIG%%' , property.value);

            }
            if (property.Name == 'ImageJSON') {

    //          configTemplate3 = configTemplate2.replace('%%IMAGECONFIG%%' , property.value);

            }
          }
        }

        resolve(result.Properties.Property);
      }
    });
	});

	let result = await promise; // wait till the promise resolves

	logger.info.log(result);

  return result;
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

  let testVal = await test();

  logger.info(testVal);

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
