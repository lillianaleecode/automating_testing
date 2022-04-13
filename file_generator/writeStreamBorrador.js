const fs = require('fs');
// JSON data
const data = require('./data.json');
// Build paths
const { buildPathHtml } = require('./buildPaths');


const createRow = (item) => `
  <tr>
        <td>${item.testName}</td>
        <td>${item.testId}</td>
        <td>${item.testDate}</td>
        <td>${item.testResult}</td>
        <td>${item.notes}</td>
        <td>${item.linkReference}</td>
  </tr>
`;


const createTable = (rows) => `
  <table>
    <tr>
        <th>Test Name</td>
        <th>Test Id</td>
        <th>Test Date</td>
        <th>Test Result</td>
        <th>Notes</td>
        <th>Link Reference</td>

    </tr>
    ${rows}
  </table>
`;

const createHtml = (table) => `
  <html>
    <head>
      <style>
        table {
          width: 100%;
        }
        tr {
          text-align: left;
          border: 1px solid black;
        }
        th, td {
          padding: 15px;
        }
        tr:nth-child(odd) {
          background: #CCC
        }
        tr:nth-child(even) {
          background: #FFF
        }
        .no-content {
          background-color: red;
        }
      </style>
    </head>
    <body>
      ${table}
    </body>
  </html>
`;





	/* generate rows */
	const rows = data.map(createRow).join('');
	/* generate table */
	const table = createTable(rows);
	/* generate html */
	const html = createHtml(table);
	/* write the generated html to file */
  
	fs.writeFileSync(buildPathHtml, html);
	console.log('Succesfully created an HTML table');
