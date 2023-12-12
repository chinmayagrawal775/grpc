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
const AIOconvertor = grpcObject.AIOconvertor;

const client = new AIOconvertor.CurrencyConvertor("127.0.0.1:11000", grpc.credentials.createInsecure());

export const convertCurrencyController = (req, res) => {
    client.convertCurrency({
        "inputCurrency": req.query.from,
        "outputCurrency": req.query.to,
        "amount": req.query.amount
    }, (err, response) => {
        console.log(response);
        res.send(response);
    });
}

export const currencyRateController = (req, res) => {
    client.getCurrencyConversionRate({
    "inputCurrency": req.query.from,
    "outputCurrency": req.query.to,
    }, (err, response) => {
        console.log(response);
        res.send(response);
    });
}

export const homeController = (req, res) => {
    res.send('Trillion Dollar Company, which can handle 1 Million concurrent request per second.');
}