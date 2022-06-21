//getting the adlib response and replacing the source to a xxx local file via page.on event.
//it works for its purpose
const puppeteer = require("puppeteer");


var url = 'https://www.bild.de';

  describe('Puppeteer for AdTech', () => {
    it('Request Iterception', async function() {
        const browser = await puppeteer.launch({
          headless: true, 
          devtools: true
        })
        const page = await browser.newPage() 
        page.on("response", async (response) => {
          // console.log(await response);
          // console.log(await response.json());
          // console.log(await response._request._resourceType);
          if (response._request._resourceType == "script" ) {
            console.log(await response._url);
            // /Users/lchung/Documents/Testing/mainTest.js
            response._url = ""
          }
        });

        page.on('console', async (msg) => {
          const msgArgs = msg.args();
          var location = msg.location();
          var source = "unknown";
          if (typeof location == "object" && location.url != "") {
          source = location.url;
          }
          if (source.includes("www.asadcdn.com")) {
              console.log("[Request URL]: " + source)
          }

          
          var fileName = source.replace("https://www.asadcdn.com/adlib/pages/bild.js", "/Users/lchung/Documents/Testing/mainTest.js")
          var filePath = "file:///" + fileName;
          
          console.log(filePath, '|', source);
       

        });

          
          

        
          
           await page.goto(url)  
        
    });
  })


