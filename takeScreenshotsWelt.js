// Taking Screenshots
const fs = require('fs');
const puppeteer = require('puppeteer')

var url = 'https://www.welt.de';



describe('Taking Screenshots<3', () => {
    it('screenshot<3', async function() {
        const browser = await puppeteer.launch({
            headless: false,
            devtools: false,
        })
        const page = await browser.newPage() 

        // Configure the navigation timeout
        await page.setDefaultNavigationTimeout(30000);

        await page.goto(url, {
            // Remove the timeout
             timeout: 0
          });


        await page.waitFor(3000);
        
        await page.setDefaultTimeout(30000);
        
        await page.setViewport({ 
            width: 1600, 
            height: 2000, 
        });


//remove the cmp layer

        try {
            var frames = await page.frames();
            var cmpFrame = frames.find(
                f => f.url().indexOf("https://cmp2.welt.de/index.html") > -1); // return frame only if source matches
                if (cmpFrame == undefined) {
                    console.log("can't find cmp frame");
                } else {
                    const cmpButton = await cmpFrame.waitForSelector('button.message-component.message-button.no-children.focusable.sp_choice_type_11');
                    await cmpButton.click();
                }
            // proof that we really clicked the right button
            //await page.screenshot({ path: 'cmpClicked.png' });
        } catch (err) {
            console.log("error getting the cmp button")
            console.log(err);
            process.exit();
        }
       
     
        

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

    

        const height = await page.evaluate(() => document.documentElement.offsetHeight);

        console.log(height)

        const viewportHeight = 200

        const numberTimes = Math.floor(height/viewportHeight);

      
        console.log(numberTimes);

        await (async () => {
            for (let i = 0; i < numberTimes; i++) {

                console.log("corrio el loop");
              
             // force lazy loading
            await page.evaluate(() => window.scrollTo(0,i*200));

            

            await page.screenshot({ 
                //path: `screenshot${Date.now()}.png`,
                path: `${path}/Screenshot from desktop ${" " + dateString + " " + Date.now()} .png`,
                type: "png",
                timeout: 30000,

            });
    
    
            }
        })();



         
  
        
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

        await browser.close()



  
        
    })
})

//to run this terminal: npm run test


