// Get Console messages from the Web

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

// EventListener for console messages - this code runs every time a console message is written
        page.on('console', async (msg) => {
            const msgArgs = msg.args();
            var location = msg.location();

            // for (let i = 0; i < msgArgs.length; ++i) {
            //   console.log(await msgArgs[i].jsonValue());
            // } 
            //console.log(msgArgs);
            //console.log(msg.type());
            //console.log(msg.text());
            //console.log(msg.args());

            // Find source from which the message is fired
            var source = "unknown";
            if (typeof location == "object" && location.url != "") {
            source = location.url;
            }
            // give out every console message
            //console.log("console." + msg._type + "(" + msg._text + ") from source: " + source);

            // filter console messages for source
            if (source.includes("www.asadcdn.com")) {
                //console.log("msg.location(): ", msg.location());
                //console.log("msg.stackTrace(): ", msg.stackTrace());
                console.log("[Message from Adlib]: console." + msg._type + "(\"" + msg._text + "\")   from source: " + source);
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
        // get a list of all elements - same as document.querySelectorAll('*')
        const elements = await page.$$('*')

        for (let i = 0; i < elements.length; i++) {
        try {
            // get screenshot of a particular element
            await elements[i].screenshot({path: `${i}.png`})
        } catch(e) {
            // if element is 'not visible', spit out error and continue
            console.log(`couldnt take screenshot of element with index: ${i}. cause: `,  e)
        }
        }

        
    })
})

//to run this terminal: npm run test


