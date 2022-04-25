// Get Console messages from the Web

const puppeteer = require('puppeteer')

const fs = require('fs');

var url = 'https://www.bild.de';

const { buildPathHtml } = require('./buildPaths');
const data = require('./data.json');
const { timeStamp } = require('console');

var title = "";

describe('Puppeteer for AdTech', () => {
    it('lauching the browser', async function() {
        const browser = await puppeteer.launch({
            headless: true, 
            devtools: true
        })
        const page = await browser.newPage() 

     
        await page.goto(url)
        title = await page.title()
        var contenidoTotal = [];
        const urlLink = await page.url()
        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)
        


        page.on('console', async function (msg) {
            const msgArgs = msg.args();
            var location = msg.location();
           
            var source = "unknown";
            if (typeof location == "object" && location.url != "") {
            source = location.url;
            }
         
            if (source.includes("www.asadcdn.com")) {
            
                console.log("[Message from Adlib]: console." + msg._type + "(\"" + msg._text + "\")   from source: " + source);

                const testCase = {
                    "testName": title,
                    "testId": 1,
                    "testDate": "5/24/2019",
                    "testResult": "Lorem Ipsum",
                    "notes": "Lorem Ipsum",
                    "linkReference": source,
                }
                console.log(testCase);


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

                console.log ("checkpoint 2")
                contenidoTotal.push(testCase)
                /* generate rows */
                const rows = contenidoTotal.map(createRow).join('');
                /* generate table */
                const table = createTable(rows);
                /* generate html */
                const html = createHtml(table);
                /* write the generated html to file */
            
                fs.writeFileSync(buildPathHtml, html);
                console.log('Succesfully created an HTML table');


                

        

            }

        
          }.bind({title: title, contenidoTotal: contenidoTotal}));


        
        await page.evaluate('console.log("message")')

       

        
    })
})

//to run this terminal: npm run test


