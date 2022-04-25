
// Get Console messages with details

const puppeteer = require('puppeteer')
var url = 'https://www.bild.de';


describe('Puppeteer for AdTech', () => {
    it('lauching the browser', async function() {
        const browser = await puppeteer.launch({
            headless: false, 
            devtools: true
        })
        const page = await browser.newPage() 
        page.on('console', async (msg) => {
            const msgArgs = msg.args();
            for (let i = 0; i < msgArgs.length; ++i) {
              console.log(await msgArgs[i].jsonValue());
            } 
            console.log(msgArgs);
            console.log(msg.type());
            console.log(msg.text());
            console.log(msg.args());
            
            
        
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
       
    })
})
