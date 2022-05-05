const puppeteer = require('puppeteer');
var fs = require('fs');
var path = require("path");
fileContent = "";

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    fileContent += "<ul>"
    for (let i = 0; i < 50; i++) {
        fileContent += "<li>" + i + "</li>"
    }
    fileContent += "</ul>"
    //await page.waitForNavigation({waitUntil: "domcontentloaded"});
    await page.goto('https://www.bild.de');
    GenerateHtmlProtocol();
})();
// See@: https://stackoverflow.com/questions/21617468/node-js-generate-html
function GenerateHtmlProtocol() {
    var fileName = 'index.html';
    var stream = fs.createWriteStream(fileName);
    var header = '<link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">'; // css file
    header += "<style>li { color: darkcyan; } ul { min-width: 800px; } </style>";
    var scripts = '<script></script>'; // script tags for very simple functions
    stream.once('open', function(fd) {
        var html = '<!DOCTYPE html>' + '<html><head>' + header + '</head><body>' + fileContent + scripts + '</body></html>';
        stream.end(html);
    });
}