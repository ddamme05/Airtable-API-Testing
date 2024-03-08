require('dotenv').config();

const Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_TOKEN
});

var base = Airtable.base(process.env.AIRTABLE_BASE_ID);


