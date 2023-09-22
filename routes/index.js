const path = require('path');
const fs = require('fs');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');

// Retrieve the config data from the Data Extension
let props;
let prop1;
let prop2;

// Call the load config method to read the data from the config data extension in MC
callLoadConfig();

logger.info('index:props');
logger.info(props);

// This will load the config from the data extension and place it into the props map 
function loadConfig() {

  logger.info('Enter loadConfig');

  return new Promise(function(resolve, reject) {

    // Read the data extension
    SFClient.deRow.get((err, res) => {
      if (err) {

        logger.info('Get err');

        logger.error(err.message);

        reject(err);
      } else {
  
        logger.info('Get result');
        
        props = [];
        let retVal = [];
        let typeMap={};
        let commsMap={};
        let imageMap={};
        let inner;
        let innerType;
        let innerTypeInner;
        let innerImage;
        let typeArr=[];

        let newTypeVal = {};
        newTypeVal.Name = 'Select Type';
        newTypeVal.Value = 'Select Type';
        
        // Push this into the new entry
        typeArr.push(newTypeVal);

        // Iterate through the results of the call to read the data extension and place it as structured JSON into props
        // in the required format for the UI to read and display 
        for (const result of res.body.Results) {
          logger.info(result.Properties);

          let commsName;
          let typeName;

          for (const property of result.Properties.Property) {
            logger.info(property);

            // Is this the Vendor
            if (property.Name == 'Type') {

              typeName = property.Value;

              // Is there already a map value for this vendor 
              if (typeMap.hasOwnProperty(property.Value))
              {
                // Get the map value
                innerType = typeMap[property.Value];
              }
              else {

                // Create a new entry 
                innerType={};
                let newTypeVal = {};

                newTypeVal.Name = property.Value;
                newTypeVal.Value = property.Value;
                
                // Push this into the new entry
                typeArr.push(newTypeVal);
        
                // Add the new map value
                typeMap[property.Value] = innerType;
              }
            }

            logger.info(typeMap);
            
            // Is this the Vendor
            if (property.Name == 'Vendor') {

              // Is there already a map value for this vendor 
              if (commsMap.hasOwnProperty(property.Value))
              {
                // Get the map value
                inner = commsMap[property.Value];
              }
              else {

                // Create a new entry, add the default comms entry 
                inner=[];
                let newVal = {};
                newVal.Name = 'Select Communication';
                newVal.Value = 'Select Communication';
                
                // Push this into the new entry
                inner.push(newVal);

                // Add the new map value
                commsMap[property.Value] = inner;
              }

              if (innerType.hasOwnProperty(property.Value))
              {
                // Get the map value
                innerTypeInner = innerType[property.Value];
              }
              else {

                // Create a new entry, add the default comms entry 
                innerTypeInner=[];
                let newVal = {};
                newVal.Name = 'Select Communication';
                newVal.Value = 'Select Communication';
                
                // Push this into the new entry
                innerTypeInner.push(newVal);

                // Add the new map value
                innerType[property.Value] = innerTypeInner;
              }

            }

            // Is this the Communication entry
            if (property.Name == 'Communication') {
              let newVal = {};
              newVal.Name = property.Value;
              newVal.Value = property.Value;

              // Add this to the inner JSON structure
              inner.push(newVal);
              innerTypeInner.push(newVal);

              commsName = property.Value;

            }

            // Is this the preview url
            if (property.Name == 'PreviewURL') {

              // There should not be an existing value
              if (imageMap.hasOwnProperty(commsName))
              {
              }
              else {

                // Add this to the image map
                imageMap[commsName] = property.Value;              
              }

            }
          }
        }

        logger.info('Resolve');
        logger.info(commsMap);
        logger.info(typeMap);
        logger.info(typeArr);

        // Add the JSON values of the two maps to the props to be returned as part of the config.json
        props.push('{"commsMap":' + JSON.stringify(commsMap) + '}');
        props.push('{"typeCommsMap":' + JSON.stringify(typeMap) + '}');
    //    props.push('{"tmCommsMap":' + JSON.stringify(typeMap['Telemarketing']) + '}');
        props.push('{"typeArr":' + JSON.stringify(typeArr) + '}');
        props.push('{"imageMap":' + JSON.stringify(imageMap) + '}');
        logger.info('props');
        logger.info(props);
                
        resolve(retVal);
      }
    });
	});

}


// This calls the 
async function callLoadConfig() {

  logger.info('callLoadConfig');

  try {
		let dataFirst = await loadConfig();

    logger.info('Called loadConfig');

		logger.info(dataFirst);

    return dataFirst;

	} catch (error) {
    logger.info('Error loadConfig');
		logger.info(error);
	}

}
/**
 * Render Config from the basic config.json file, pushing in the data that was loaded from the config Data Extension
 * @param req
 * @param res
 */
exports.config = (req, res) => {
  const domain = req.headers.host || req.headers.origin;
  const file = path.join(__dirname, '..', 'public', 'config-template.json');

  let configTemplate = fs.readFileSync(file, 'utf-8');
  let configTemplate2;
  let configTemplate3;

  logger.info('config:props');
  logger.info(props);

  try {

    // Get the comms config JSON as read from the data extension and push it into the config.json
   // configTemplate2 = configTemplate.replace('%%COMMSCONFIG%%' , props[0]);

   // logger.info(configTemplate2);

//    configTemplate3 = configTemplate2.replace('%%DMCOMMSCONFIG%%' , props[1]);

//    logger.info(configTemplate3);

    configTemplate3 = configTemplate.replace('%%TYPECOMMSCONFIG%%' , props[1]);

    logger.info(configTemplate3);

    configTemplate4 = configTemplate3.replace('%%TYPECONFIG%%' , props[2]);

    logger.info(configTemplate4);

    // Get the image config JSON as read from the data extension and push it into the config.json
    configTemplate5 = configTemplate4.replace('%%IMAGECONFIG%%' , props[3]);

    logger.info(configTemplate5);

    // Replace the domain
    let config = JSON.parse(configTemplate5.replace(/\$DOMAIN/g, domain));

    logger.info(JSON.stringify(config));

    // Return the config.json as processed
    res.json(config);

} catch (error) {

  logger.info('Get error');

  logger.error(JSON.stringify(error));  
}

};

/**
 * Render UI from the index file
 * @param req
 * @param res
 */
exports.ui = (req, res) => {
  res.render('index', {
    title: 'Direct Mail Configuration',
    dropdownOptions: [
      {
        name: 'Select Vendor',
        value: 'Select Vendor',
      },

    ],
    typeOptions: [
      {
        name: 'Select Type',
        value: 'Select Type',
      },
    ],
    dropdownCommunications: [
      {
        name: 'Select Communication',
        value: 'Select Communication',
      },
    ],
  });
};
