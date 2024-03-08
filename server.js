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

app.get("/api/records", (req, res) => {
  const records = [];
  base("Volunteers")
    .select({
        fields: ['Name', 'Phone']
    })
    .eachPage(
      function page(pageRecords, fetchNextPage) {
        pageRecords.forEach((record) => {
          records.push(record.fields);
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return res.status(500).send("Error retrieving records");
        }
        res.status(200).json(records);
      }
    );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
