// Taking Screenshots
const fs = require('fs');
const puppeteer = require('puppeteer')

var url = 'https://www.bild.de';



describe('Taking Screenshots', () => {
    it('screenshot', async function() {
        const browser = await puppeteer.launch({
            headless: true,
            devtools: false,
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

        await page.screenshot({ 
            //path: `screenshot${Date.now()}.png`,
            path: `${path}/Screenshot from desktop ${" " + dateString + " " + Date.now()} .png`,
            type: "png",
            fullPage: true,

         });

         // Emulates an iPhone X
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
        await page.setViewport({ width: 375, height: 812 });
        await page.goto(url);

        await page.screenshot({ 
            path: `${path}/Screenshot from mobile ${" " + dateString + " " + Date.now()} .png`,
            type: "png",
            fullPage: true,

         });


//

        
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)



  
        
    })
})

//to run this terminal: npm run test


