//How to use: 1) npm test requestInterception2
//2.  type the link in the Chromium Browser.
const puppeteer = require('puppeteer');

const scriptUrlPatterns = [
  '*'
]

async function interceptRequestsForPage(page) {
  const client = await page.target().createCDPSession(); //Chrome DevTool Protocol

  await client.send('Network.enable');

  await client.send('Network.setRequestInterception', { 
    patterns: scriptUrlPatterns.map(pattern => ({
      urlPattern: pattern, resourceType: 'Script', interceptionStage: 'HeadersReceived'
    }))
  });

  client.on('Network.requestIntercepted', async ({ interceptionId, request}) => {
    if (request.url.includes("www.asadcdn.com")) {
        console.log(`INTERCEPTED: ${request.url} {interception id: ${interceptionId}}`)

        var fileName = request.url.replace(request.url, "/Users/lchung/Documents/Testing/mainTest.js")
          var filePath = "file:///" + fileName;
          
          console.log("NEW URL:" + filePath);
    };

    
  });
}

(async function main(){
  const browser = await puppeteer.launch({
    headless:false, 
    defaultViewport:null,
    devtools: true,
  });

  const page = (await browser.pages())[0];

  await interceptRequestsForPage(page);

  browser.on('targetcreated', async (target) => {
    const page = await target.page();
    await interceptRequestsForPage(page);
  })

})()