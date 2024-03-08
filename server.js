require("dotenv").config();
const express = require("express");
const Airtable = require("airtable");
const app = express();
const port = process.env.PORT;

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_TOKEN,
});

var base = Airtable.base(process.env.AIRTABLE_BASE_ID);

app.use(express.json());

app.get("/api/records", async (req, res) => {
    const tableName = req.query.tableName;
    const fields = req.query.fields ? req.query.fields.split(',') : [];

    if (!tableName) {
        return res.status(400).send("Table name is required as a query parameter.");
    }

    try {
        const records = await fetchRecordsFromAirtable(tableName, fields);
        console.log(`Sending ${records.length} records`); // Debugging stuff
        res.status(200).json(records);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Error retrieving records from table ${tableName}`);
    }
});

async function fetchRecordsFromAirtable(tableName, fields, options = {}) {
    const records = [];
    try {
        await base(tableName).select({
            fields: fields,
            ...options
        }).eachPage(async (pageRecords, fetchNextPage) => {
            records.push(...pageRecords.map(record => record.fields));
            await fetchNextPage();
        });
    } catch (err) {
        console.error(`Error fetching records from Airtable: ${err}`);
        throw err;
    }
    return records;
}



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
