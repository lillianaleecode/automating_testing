
// Get Console messages with details

const puppeteer = require('puppeteer')
var url = 'https://www.bild.de';


describe('Puppeteer for AdTech', () => {
    it('lauching the browser', async function() {
        const browser = await puppeteer.launch({
            headless: false, 
            //slowMo: 50, 
            devtools: true
        })
        const page = await browser.newPage() 
        page.on('console', async (msg) => {
            const msgArgs = msg.args();
            // for (let i = 0; i < msgArgs.length; ++i) {
            //   console.log(await msgArgs[i].jsonValue());
            // } 
            //console.log(msgArgs);
            //console.log(msg.type());
            //console.log(msg.text());
            //console.log(msg.args());
            if (msg.text().includes("AdLib")){
                console.log(msg.location());
                //console.log(msg.stackTrace());
                console.log(msgArgs);
                console.log(msg.type());
                console.log(msg.text());
                console.log(msg.args());
            
            } 
            
        
          });
        await page.evaluate('console.log("message")')

        await page.goto(url)
        const title = await page.title()
        const urlLink = await page.url()
        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)
        ////
        // const ads = await page.evaluate("adSSetup"); //retrieves the adSetup
        // console.log(ads);
        ////
        console.log("code for retrieving url and http requests: ");
        //page.on('console', message =>
       // console.log(`${message.type().substring(0, 3).toUpperCase()} ${message.text()}`))
        


       /*  page.on('pageerror', ({ message }) => console.log(message))
        page.on('response', response =>
        console.log(`${response.status()} ${response.url()}`))
        page.on('requestfailed', request =>
        console.log(`${request.failure().errorText} ${request.url()}`)) */
        ////
/*
        const msgPromise = new Promise((resolve) => {
            page.on('console', resolve);
          });
        //await page.evaluate('console.log("message")');
        const msg = await msgPromise;
        console.log({
        
        type: msg.type(),
        text: msg.text(),
        args: msg.args(),
        //stacktrace: msg.stacktrace(),
        //location: msg.location(),
        });
        */
        
        
       // console.log(await page.evaluate(() => "bild.js"));
        //const adJsFile = await page.content('bild.js'); //retrieves the website but not the bild.js file..
       // console.log(adJsFile);

        //await page.goBack()
        //await page.waitFor(3000) //passing the amount of time i want to wait for
        //await page.reload() //reload browser
        //await browser.close() //close browser after finishing the script
    })
})
//to run this, we add this in the package.json
//to run this terminal: npm run test
//to filter things
