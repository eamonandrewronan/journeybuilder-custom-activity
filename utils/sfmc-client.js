const FuelRest = require('fuel-rest');
const ET_Client = require('sfmc-fuelsdk-node');

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

  const origin              = 'https://endpoint.rest.marketingcloudapis.com/';
  const authOrigin          = 'https://endpoint.auth.marketingcloudapis.com/';
  const soapOrigin          = 'https://endpoint.soap.marketingcloudapis.com/';
  
  
  const etclient = new ET_Client(
    process.env.SFMC_CLIENT_ID, 
    process.env.SFMC_CLIENT_SECRET, 
    process.env.STACK, 
    {
      `https://${process.env.SFMC_SUBDOMAIN}.rest.marketingcloudapis.com/`, 
      `https://${process.env.SFMC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/token`, 
      soapOrigin, 
      authOptions: { 
        authVersion: 2, 
        accountId: process.env.SFMC_ACCOUNT_ID, 
        scope: 'data_extensions_read data_extensions_write',
        applicationType: 'server'
      }
    }
  ); 

  /**
 * Save data in DE
 * @param externalKey
 * @param data
 * @returns {?Promise}
 */
const saveData = async (externalKey, data) => client.post({
  uri: `/hub/v1/dataevents/key:${externalKey}/rowset`,
  headers: {
    'Content-Type': 'application/json',
  },
  json: true,
  body: data,
});

const deRow = etclient.dataExtensionRow({
  Name: process.env.CONFIG_DE,
  props: ['DropDownJSON', 'ImageJSON']
  // to return all rows, delete the filter property
});

module.exports = {
  client,
  saveData,
  deRow,
};
