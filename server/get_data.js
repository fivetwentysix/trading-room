// Get intraday data for the SPY.

const moment = require('moment');
const https = require('https');
const querystring = require('querystring');
const process = require('process');
const fs = require('fs');

const symbol = 'SPY';
const apikey = process.env.AMERITRADE_API_KEY;

console.log(`[${moment()}] Trading Room Fetching Intraday ${symbol} Data`);

const query = querystring.stringify({
  apikey,
  periodType: 'day',
  period: 10,
  frequencyType: 'minute',
  frequency: 1
});

const options = {
  hostname: 'api.tdameritrade.com',
  port: 443,
  path: `/v1/marketdata/${symbol}/pricehistory?${query}`,
  method: 'GET'
};

const req = https.request(options, (res) => {
  let data = new String();

  res.on('data', (d) => {
    data = data + String(d);
  });

  res.on('end', () => {
    fs.writeFileSync(`${__dirname}/../src/data.json`, data);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();