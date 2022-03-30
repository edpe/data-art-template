# Data scale

A boilerplate app to facilitate using [ONS data](https://www.ons.gov.uk/) in creative browser based artwork.

To use google sheets you will need to set up a [Google Service Account](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account)

This will generate a json file which you will need to rename and save in the root of your project as secrets.json.

You will also need to update your env.local to point to your chosen google sheet ID (can be found inthe url of your google sheet)

Sheets need to be in the format shown in the example below (headings can be any string):

|date|datatype1|datatype2|datatype3|datatypeX etc|
|---|---|---|---|---|
| 01/09/1990 00:00:00 | 7.2  | 9.2  | 3  |  4.5 |
| 01/010/1990 00:00:00 | 6.7  | 9.8  | 3.2  |  4 |




## Getting Started

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
