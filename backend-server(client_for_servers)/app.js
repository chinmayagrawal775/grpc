import express from 'express';
import { convertCurrencyController, currencyRateController, homeController } from './index.js';

const app = express()

app.get('/', homeController);
app.get('/convert-currency', convertCurrencyController);
app.get('/conversion-rate', currencyRateController);

app.listen(30000, () => {
    console.log(`Server Listening on http://localhost:${30000}`);
});