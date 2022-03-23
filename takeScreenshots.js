// Taking Screenshots

const puppeteer = require('puppeteer')

var url = 'https://www.bild.de';



describe('Taking Screenshots', () => {
    it('screenshot', async function() {
        const browser = await puppeteer.launch({
            headless: false,
            devtools: true
        })
        const page = await browser.newPage() 

        await page.goto(url)
        
        await page.setViewport({ 
            width: 1300, 
            height: 2000, 
            //deviceScaleFactor: 1 
        });

//get the current timestamp, stringify it and use it as file name for the screenshot

        const currentDate = new Date();

        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const dateString = " " + currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;
        // "day-month-2022"

        await page.screenshot({ 
            //path: `screenshot${Date.now()}.png`,
            path: `screenshot${dateString}.png`,
            type: "jpeg",
            fullPage: true,

         });

        
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

  
        
    })
})

//to run this terminal: npm run test


