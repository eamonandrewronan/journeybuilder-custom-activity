const path = require('path');
const fs = require('fs');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');

let props;
callTest();

logger.info('props');
logger.info(props);

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
        
        props = [];
        let retVal = [];
        for (const result of res.body.Results) {
          for (const property of result.Properties.Property) {
            logger.info(property);

            if (property.Name == 'DropDownJSON') {

              prop1 = property.value;

              retVal.push(prop1);
              props.push(prop1);

  //            configTemplate2 = configTemplate.replace('%%COMMSCONFIG%%' , property.value);

            }
            if (property.Name == 'ImageJSON') {
              prop2 = property.value;
              retVal.push(prop2);
              props.push(prop2);

    //          configTemplate3 = configTemplate2.replace('%%IMAGECONFIG%%' , property.value);

            }
          }
        }

        logger.info('Resolve');
        logger.info('props');
        logger.info(JSON.stringify(props));
        logger.info('retVal');
        logger.info(JSON.stringify(retVal));
                
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

		logger.info(JSON.stringify(dataFirst));

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

  logger.info('props');
  logger.info(props);

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
