// Get Console messages from the Web

const puppeteer = require('puppeteer')

var url = 'https://www.bild.de';



describe('Puppeteer for AdTech', () => {
    it('lauching the browser', async function() {
        const browser = await puppeteer.launch({
            headless: true, 

            devtools: true
        })
        const page = await browser.newPage() 

        page.on('console', async (msg) => {
            const msgArgs = msg.args();
            var location = msg.location();

            // Find source from which the message is fired
            var source = "unknown";
            if (typeof location == "object" && location.url != "") {
            source = location.url;
            }

            // filter console messages for source
            if (source.includes("www.asadcdn.com")) {
                console.log("[Message from Adlib]: console." + msg._type + "(\"" + msg._text + "\")   from source: " + source);
            }

        
          });

        await page.evaluate('console.log("message")')


        await page.goto(url)
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

      


        
    })
})

//to run this terminal: npm run test


