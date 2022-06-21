//Ad Delivery Mediation via Page.on event.
//IT WORKS!
const puppeteer = require("puppeteer");

var url = 'https://www.bild.de/gewinnspiele/bildplus-aktion/bild-feiert-den-70-geburtstag-taeglich-coupons-holen-sparen-80347132.bild.html';

  describe('Puppeteer for AdTech', () => {
    it('Mediation Script Check', async function() {
//Puppeteer basic config
        const browser = await puppeteer.launch({
          headless: false, 
          devtools: true
        })
        const page = await browser.newPage() 

// Configure the navigation timeout
        this.timeout(0);

        await page.goto(url, {
             timeout: 0
          });

        

        await page.setDefaultTimeout(0);
        
        await page.setViewport({ 
            width: 1600, 
            height: 2000, 
           
        });

//remove the cmp layer so that mediation script will render.
//it is not working, as I need to remove the CMP manually :/ its like the page is rendering twice.

        async function removeCMP(){
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
                // console.log(err);
                // process.exit();
            }

        }

        await removeCMP();
                

//getting page response.

       

        await removeCMP();
        page.on("response", async (response) => {
            
            if (response._request._resourceType == "script" && response._url.includes("https://www.asadcdn.com/adlib/libmodules/extensions/mediation") ) {
              console.log(" ✅  Source of our own Mediation Script:" + await response._url);
              
            } 
            
            if (response._request._resourceType == "script" && response._url.includes("https://acdn.adnxs-simple.com/ast/mediation/") ) {
              console.log(" ❌ Default version source from Xandr Mediation Script:" + await response._url);
            }
          });

           await page.goto(url)  
        
    });
  })

 // page.on("response", async (response) => {
        //   // console.log(await response);
        //   // console.log(await response.json());
        //   // console.log(await response._request._resourceType);
        //   if (response._request._resourceType == "script" ) {
        //     console.log(await response._url);
        //     response._url = ""
        //   }
        // });
        
  // page.on('request', async (request) => {
  //   console.info("URL", request.url());
  //   console.info("Method", request.method())
  //   console.info("Headers", request.headers())
  //   return request.continue(); // Allow request to continue
  //   // return request.abort(); // use this instead to abort the request!
// })