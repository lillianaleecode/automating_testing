// PDF Creation File
const fs = require('fs');
const puppeteer = require('puppeteer')

var url = 'https://www.bild.de/news/ausland/news-ausland/schweiz-iphone-rettet-abgestuerztem-snowboarder-das-leben-79683022.bild.html'


describe('create PDF file', () => {
    it('PDF<3', async function() {
        const browser = await puppeteer.launch({
            headless: true, //printing is only supported in headless mode!
            devtools: false,
            
        })
        const page = await browser.newPage(); 

        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        

        this.timeout(0);

        await page.goto(url, {
           
             timeout: 0
          });

       
        await page.setDefaultTimeout(0);
        
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
            
        } catch (err) {
            console.log("error getting the cmp button")
            console.log(err);
            process.exit();
        }
       
     
        

//get the current timestamp

        const currentDate = new Date();

        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const dateString = " " + currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear + " " + Date.now();
        // "day-month-2022"

//creating a folder
        const path = `tests/pdf/${dateString}`;

        fs.mkdirSync(path);

    

        const height = await page.evaluate(() => document.documentElement.offsetHeight);

        console.log(height)

        const viewportHeight = 2000

        const numberTimes = Math.floor(height/viewportHeight);
        console.log(numberTimes);

        //scroll full page
        async function autoScroll(page){
            await page.evaluate(async () => {
                await new Promise((resolve, reject) => {
                    var totalHeight = 0;
                    var distance = 500;
                    var timer = setInterval(() => {
                        var scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
        
                        if(totalHeight >= scrollHeight - window.innerHeight){
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });
            });
        }
        await autoScroll(page);

        await page.emulateMediaType('screen');

        

        await page.waitForTimeout(1500);

        await page.pdf({ 
            path: `${path}/PDF ${" " + dateString + " " + Date.now()} .pdf`,
            printBackground: true,
            scale: 0.5,
            format: "a6",
            margin: {top:"50px", left:"50px", right:"50px"},
            landscape: false,
            displayHeaderFooter: true, 

        });

        await page.waitForTimeout(250);



    
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

        await browser.close()



  
        
    })
})



