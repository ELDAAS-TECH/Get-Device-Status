const { TuyaContext } = require('@tuya/tuya-connector-nodejs');
// **Error handling and logging:**
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: 'tuya_log.log' })]
});

// Creating a new instance of TuyaContext and providing the necessary configuration parameters
const tuya = new TuyaContext({
  baseUrl: 'https://openapi.tuyain.com', // Base URL for the Tuya API(WESTERN AMERICA DATA CENTER)
  accessKey: 'vwquhh43jrynyt5f788g', // Access key for authentication
  secretKey: 'b1dd8928e6cc4af3a0fea572cacf5830', // Secret key for authentication
});

// **Asynchronous function calling the Tuya API:**
async function TuyaRequest(method, path, body = {}) {
  try {
    logger.info(`Making request: method=${method}, path=${path}`);
    logger.debug(`Request body: ${JSON.stringify(body)}`); // Log body for debugging

    const result = await tuya.request({
      path: path,
      method: method,
      body
    });

    logger.info(`Request result: ${JSON.stringify(result)}`);
    return result; // Return the result
  } catch (error) {
    logger.error(`Error during request: ${error.message}`);
    throw error; // Re-throw the error for further handling
  }
}

// **Infinite loop with error handling and defined polling interval (replace 5000 with your desired interval in milliseconds):**
async function main() {
  try {
    while (true) {
      const method = 'GET';
      const url = `/v2.0/cloud/thing/d778e9d9d7d0ebefcf4aiq/shadow/properties`;

      let data = await TuyaRequest(method, url);
      // Process the data here (replace with your processing logic)
      console.log(data); // Example usage, replace with your logic

      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before next request
    }
  } catch (error) {
    logger.error('An error occurred:', error.message);
    // Handle the error here (e.g., restart loop after a delay)
  }
}

// Execute the main function
main();