// Taking Screenshots
const fs = require('fs');
const puppeteer = require('puppeteer')

var url = 'https://www.bild.de';



describe('Taking Screenshots', () => {
    it('screenshot', async function() {
        const browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            //slowMo: 50,
        })
        const page = await browser.newPage() 

        await page.goto(url, {
            waitUntil: 'networkidle2' //Wait for all non-lazy loaded images to load. networkidle2 works better than load, domcontentloaded or networkidle0
          });

        
        
        
        await page.setViewport({ 
            width: 1600, 
            height: 2000, 
            //deviceScaleFactor: 1 
        });

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

        //Screenshop Desktop Size
        await page.screenshot({ 
            //path: `screenshot${Date.now()}.png`,
            path: `${path}/Screenshot from desktop ${" " + dateString + " " + Date.now()} .png`,
            type: "png",
            fullPage: true,

         });

         //partial desktop screenshot with coordinates
         await page.screenshot({
            path: `${path}/Partial Screenshot from desktop ${" " + dateString + " " + Date.now()} .png`,
            'clip': {
                'x': 600, 
                'y': 0, 
                'width': 650, 
                'height': 650}
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

         
  
        
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

        await browser.close()



  
        
    })
})

//to run this terminal: npm run test


