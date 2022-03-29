// Taking Screenshots
const fs = require('fs');
const puppeteer = require('puppeteer')

var url = 'https://www.bild.de';



describe('Taking Screenshots', () => {
    it('screenshot', async function() {
        const browser = await puppeteer.launch({
            headless: true,
            devtools: false,
            //slowMo: 50,
        })
        const page = await browser.newPage() 

        await page.goto(url)
        
        await page.setViewport({ 
            width: 1600, 
            height: 2000, 
            //deviceScaleFactor: 1 
        });



//get the current timestamp, stringify it and use it as file name for the screenshot

        const currentDate = new Date();

        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const dateString = " " + currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear + " " + Date.now();
        // "day-month-2022"

//creating a folder
//there is no puppeteer function to create automatically a folder. it is necessary to use node Fs method.
        const path = `tests/screenshots/${dateString}`;

        fs.mkdirSync(path);

        //Screenshop Desktop Size
        await page.screenshot({ 
            //path: `screenshot${Date.now()}.png`,
            path: `${path}/Screenshot from desktop ${" " + dateString + " " + Date.now()} .png`,
            type: "png",
            fullPage: true,

         });

         // Screenshot Emulate of an iPhone X
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
        await page.setViewport({ width: 375, height: 812 });
        await page.goto(url);

        await page.screenshot({ 
            path: `${path}/Screenshot from mobile ${" " + dateString + " " + Date.now()} .png`,
            type: "png",
            fullPage: true,

         });

         //Screenshot of specific element
         const selectors_desktop = ["#superbanner", "#mrec", "#billboard", "#sky"]
         const selectors_mobile = ["#banner", "#mrec", "#inpage"]

         //const select = await page.waitForSelector('#mrec_btf')
         //await page.setViewport({ width: 375, height: 812 });
        // await select.screenshot({path: `${path}/Screenshot from mobile ${" " + dateString + " " + Date.now()} .png`,})
         
        //   await page.waitForSelector('#mrec');          // wait for the selector to load
        //   const element = await page.$('#mrec');        // declare a variable with an ElementHandle
        //   await element.screenshot({path: 'elementscreenshot.png'});
                                 



        //  for (let index = 0; index < select.length; index++) {
        //      const x = select[index];
        //      await select.screenshot({ 
        //                     path: `${path}/Screenshot of an element ${" " + dateString + " " + Date.now()} .png`,
        //                     type: "png",
        //                  })

             
        //  }

        //function for getting the element 
        describe("taking screenshot single element",()=>{
            it("element screenshot", async function(){
                const select = await page.getAttribute("#mrec")
                await select.screenshot({ 
                    path: `${path}/Screenshot of an element ${" " + dateString + " " + Date.now()} .png`,
                    type: "png",
                 })
            })
        })
         


        //  let id = document.getElementsByTagName("div").id;
        //  document.getElementById("mrec").innerHTML = id;
        //  await select.screenshot({ 
        //          path: `${path}/Screenshot of an element ${" " + dateString + " " + Date.now()} .png`,
        //          type: "png",
        //         })




         //const matches = document.querySelectorAll("#superbanner")
        //  const select = element.getAttribute("#mrec")
        //  await select.screenshot({ 
        //      path: `${path}/Screenshot of an element ${" " + dateString + " " + Date.now()} .png`,
        //      type: "png",
        //     })

        //  for (const x of selectors_desktop ){
        //     var elem = document.getElementById(x)
        //     elem == true
        //     console.log("found:" + x)
        //     ;
        // }

        // get a list of all elements - same as document.querySelectorAll('*')
        const elements = await page.$$('#mrec')

        for (let i = 0; i < elements.length; i++) {
        try {
            // get screenshot of a particular element
            await elements[i].screenshot({path: `${i}.png`})
        } catch(e) {
            // if element is 'not visible', spit out error and continue
            console.log(`couldnt take screenshot of element with index: ${i}. cause: `,  e)
        }
        }

    

//

        
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

        await browser.close()



  
        
    })
})

//to run this terminal: npm run test


