// it doesnt work.

//How to use: #1 npm test requestInterception2
//example: https://www.bild.de/geld/wirtschaft/wirtschaft/diesel-desaster-sprit-steuernachlass-komplett-aufgefressen-80455674.bild.html
//#2  type the link in the Chromium Browser.

const puppeteer = require('puppeteer');

const scriptUrlPatterns = [
  '*'
]//A URL pattern is a set of ordered characters to which the Google Search Appliance matches actual URLs that the crawler discovers. You can specify URL patterns for which your index should include matching URLs and URL patterns for which your index should exclude matching URLs.



async function interceptRequestsForPage(page) {

  //initialize CDP for intercepting
  const client = await page.target().createCDPSession(); //this opens and creates a session of the Chrome DevTool Protocol attached to the target.Interaction with CDP happens over Web Sockets.

  //setting interception: intercept at the ‘HeadersReceived’ stage
  await client.send('Network.enable');

  await client.send('Network.setRequestInterception', { 
    patterns: scriptUrlPatterns.map(pattern => ({
      urlPattern: 
      pattern, //we want all URLs
      resourceType: 'Script', //what is 
      interceptionStage: 'HeadersReceived' //the stage
    }))
  });

//listening this event for the Network.requestIntercepted event to hook into traffic.
  //interceptionId will allow to get the body of the interception and then continue or abort the intercepted request with Network.continueInterceptedRequest.   
  client.on('Network.requestIntercepted', ({ interceptionId }) => {
    console.log(`INTERCEPTED: ${request.url} {interception id: ${interceptionId}}`)
    client.send('Network.continueInterceptedRequest', {
      interceptionId,
    });
  });
}

(async function main(){

//normal basic puppeteer set up
  const browser = await puppeteer.launch({
    headless:false, 
    defaultViewport:null,
    devtools: true,
  });

  //Initializing a CDP session across all tabs
  const page = (await browser.pages())[0];

  
//intercept request function call
  await interceptRequestsForPage(page);

  browser.on('targetcreated', async (target) => {
    const page = await target.page();
    await interceptRequestsForPage(page);
  })

})()