import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the path to .proto file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.resolve(__dirname, '../convertor.proto');

// Configurations to load the package that we define in convertor.proto file.
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const currencyService = grpcObject.AIOconvertor.CurrencyConvertor;

// Server Configuration
const server = new grpc.Server();
server.addService(currencyService.service, {
    convertCurrency: convertCurrency,
    getCurrencyConversionRate: getCurrencyConversionRate,
});
server.bindAsync('0.0.0.0:11000', grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.log(err)
      }
      server.start();
      console.log(`listening on port ${port}`)
    }
  )

/** Method Definitions */

async function convertCurrency(call, callback) {

    const inputCurrency = call.request.inputCurrency;
    const outputCurrency = call.request.outputCurrency;
    const amount = call.request.amount;

    const response = await fetch(`https://open.er-api.com/v6/latest/${inputCurrency}`);
    const rate = await response.json()
    const conversionRate = rate.rates[outputCurrency.toUpperCase()];

    const convertedAmount = {
        amount: conversionRate * amount
    };

    callback(null, convertedAmount);
}

async function getCurrencyConversionRate(call, callback) {

    const inputCurrency = call.request.inputCurrency;
    const outputCurrency = call.request.outputCurrency;

    const response = await fetch(`https://open.er-api.com/v6/latest/${inputCurrency}`);
    const rate = await response.json()
    const conversionRate = {
        rate: rate.rates[outputCurrency.toUpperCase()]
    };

    callback(null, conversionRate);
}