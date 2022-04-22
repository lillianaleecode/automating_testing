// PDF Creation File
const fs = require('fs-extra');
const puppeteer = require('puppeteer')




describe('create PDF protocol', () => {
    it('PDF<3', async function() {
        const content = fs.readFileSync("./build.html", "utf8");
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(content);

        await page.emulateMediaType('screen');

        console.log("process done");

        

       

//get the current timestamp, stringify it and use it as file name for the screenshot

        const currentDate = new Date();

        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const dateString = " " + currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear + " " + Date.now();
        // "day-month-2022"

//creating a folder
        const path = `tests/pdf/${dateString}`;

        fs.mkdirSync(path);
       
        await page.pdf({ 
            path: `${path}/PDF ${" " + dateString + " " + Date.now()} .pdf`,
            printBackground: true,
            scale: 0.5,
            format: "a6",
            margin: {top:"50px", left:"50px", right:"50px"},
            landscape: false,
            displayHeaderFooter: true, //helps to load left images to render

        });


    
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

        await browser.close();
        process.exit();



  
        
    })
})



