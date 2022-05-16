
// Get Console messages from the Web
const puppeteer = require('puppeteer')
var url = 'https://m.bild.de/sport/mehr-sport/boxen/heute-bei-bild-im-tv-ab-22-uhr-die-grosse-doku-ueber-felix-sturm-79503584.bildMobile.html###wt_ref=https%3A%2F%2Fwww.bild.de%2Fvideo%2Fmediathek%2Fvideo%2Fbild-live-71144736.bild.html&wt_t=1652095830144'

// https://stackoverflow.com/questions/46198527/puppeteer-log-inside-page-evaluate

describe('Puppeteer for AdTech', () => {
    it('lauching the browser', async function() {
        const browser = await puppeteer.launch({
            headless: false, 
            devtools: true
        })
        const page = await browser.newPage() 
        //page.on("console", (consoleObj) => console.log(consoleObj.text()));

        await page.goto(url)
        //remove the cmp layer
        try {
            var frames = await page.frames();
            var cmpFrame = frames.find(
                f => f.url().indexOf("https://cmp2.bild.de/index.html") > -1); // return frame only if source matches
                if (cmpFrame == undefined) {
                    console.log("can't find cmp frame");
                } else {
                    const cmpButton = await cmpFrame.waitForSelector('button.message-component.message-button.no-children.focusable.sp_choice_type_11');
                    await cmpButton.click();
                }
    
        } catch (err) {
            console.log("error getting the cmp button")
            console.log(err);
            process.exit();
        }  
        
        for (var i = 0; i < adSlots.length; i++) {
            page.on('console', consoleObj => {
                if (consoleObj.type() == 'warning') {
                    console.log(consoleObj.text());
                }
            })
        }

        



        // page.on('console', (log) => 
        // console[log._type](log._text));

       
// page.on('console', (consoleMessageObject) => {
//     if (consoleMessageObject._type == 'warning') {
//         console.debug(consoleMessageObject._text)
//         console.log(consoleMessageObject._text)
//     }
// });


// page.on('console', msg => {
//     for (let i = 0; i < msg._args.length; ++i)
//         console.error(`${i}: ${msg._args[i]}`);
//     });

// page.evaluate(() => console.error());


        // page.on('console', async (msg) => {
        //     const msgArgs = msg.args();
        //     var location = msg.location();
        //     // Find source from which the message is fired
        //     var source = "unknown";
        //     if (typeof location == "object" && location.url != "") {
        //     source = location.url;
        //     }
        //     // filter console messages for source
        //     if (source.includes("www.asadcdn.com")) {
        //         console.log("[Message from Adlib]: console." + msg._type + "(\"" + msg._text + "\")   from source: " + source)
        //     }
        //     if (msg._text.includes("alpha loaded")) {
        //         console.log("Lilly check: "  + msg._text.slice(0,15))
        //         const addVersion = msg._text.slice(6,15);
        //         const addVersionConcat = "<h3>" + "Testing with Adlib version" + addVersion + "(development)" + "</h3>" + "<br>"
        //         console.log( addVersionConcat );
                
        //     };
            
        
        //   });
         
        // await page.evaluate('console.log("message")')

        
        // const title = await page.title()
        // const urlLink = await page.url()
        // console.log('Title: ' + title)
        // console.log('URL: ' + urlLink)
      

        
    })
})

