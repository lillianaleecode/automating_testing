// Taking Screenshots
const fs = require('fs');
const puppeteer = require('puppeteer')

var url = 'https://www.bild.de';



describe('Taking Screenshots<3', () => {
    it('screenshot<3', async function() {
        const browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            //slowMo: 50,
        })
        const page = await browser.newPage() 

        // Configure the navigation timeout
        await page.setDefaultNavigationTimeout(30000);

        await page.goto(url, {
            //waitUntil: 'networkidle2', //Wait for all non-lazy loaded images to load. networkidle2 works better than load, domcontentloaded or networkidle0
            // Remove the timeout
             timeout: 0
          });

        // force lazy loading
        // await page.evaluate(() => window.scrollTo(0, Number.MAX_SAFE_INTEGER));

        await page.waitFor(3000);
        
        //
        // await page
        // .waitForSelector('#red-teaser-image')
        // .then(() => console.log('got it'));

        await page.setDefaultTimeout(30000);
        
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

    

        const height = await page.evaluate(() => document.documentElement.offsetHeight);

        console.log(height)

        const viewportHeight = 2000

        const numberTimes = Math.floor(height/viewportHeight);
        console.log(numberTimes);

       

        //this code will scroll until the end of the page (full page)
        async function autoScroll(page){
            await page.evaluate(async () => {
                await new Promise((resolve, reject) => {
                    var totalHeight = 0;
                    var distance = 100;
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


//scrolling function (for by distance partial)
        async function autoScroll2(page, distance){
            await page.evaluate(async (distance) => {
                await new Promise((resolve, reject) => {
                    window.scrollBy(0, distance);
                    resolve()
                });
            },distance);
        }
//screenshot by distance (partial)
        async function screenshot2(page){
            for (let i = 0; i < numberTimes; i++){
                await autoScroll2(page, 2000);
                await page.screenshot({ 
                    //path: `screenshot${Date.now()}.png`,
                    path: `${path}/Screenshot from desktop ${" " + dateString + " " + Date.now()} .png`,
                    type: "png",
                    timeout: 30000,
                })

            }
        }


        console.log("hello 3");
        await screenshot2(page);

    
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

        await browser.close()



  
        
    })
})

//to run this terminal: npm run test takeScreenshots.js


