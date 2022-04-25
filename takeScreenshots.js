// Taking Screenshots
const fs = require('fs');
const puppeteer = require('puppeteer')

//var url = 'https://www.bild.de';
var url = 'https://www.bild.de/news/ausland/news-ausland/schweiz-iphone-rettet-abgestuerztem-snowboarder-das-leben-79683022.bild.html'



describe('Taking Screenshots<3', () => {
    it('screenshot<3', async function() {
        const browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            //slowMo: 50,
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
       
     
        

//get the current timestamp, "day-month-2022"


        const currentDate = new Date();

        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const dateString = " " + currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear + " " + Date.now();
        
//creating a folder

        const path = `tests/screenshots/${dateString}`;

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

// scroll to end of page to load all sightloader slots
        await autoScroll(page);
        adSSetup = await page.evaluate("adSSetup");
        adSlots = adSSetup["adPlacements"];

        console.log("adSlots = ", adSlots)

        for (var i = 0; i < adSlots.length; i++) {
            console.log("current slot ", adSlots[i])
            // check if slot exists
            var selector = adSlots[i];
            var slotFound = await page.evaluate( async (selector) => {
                var slot = document.getElementById(selector);
                return slot ? true : false
            }, selector);

            console.log("selector found ", slotFound)
            // if slot exists - scroll into view & take screenshot
            if (slotFound) {
                await ScrollAdslotIntoView(page, adSlots[i]);
                await page.waitForTimeout(1500);
                console.log("a")
                await page.screenshot({ path: "tests/screenshots/" + adSlots[i] + ".png" });
                console.log("b")
                await page.waitForTimeout(250);
            } else {
                console.log("no slot for " + adSlots[i] + " found");
            }
        }


        async function ScrollAdslotIntoView(page, _adSlot) {
            console.log("ScrollAdslotIntoView(" + _adSlot + ") was called");
            await page.evaluate(async (_adSlot) => {
                return await new Promise(resolve => {
                    setTimeout(() => {
                        console.log("looking for adslot " + _adSlot);
                        var slot = document.getElementById(_adSlot);
                        if (slot != null) {
                            slot.scrollIntoView();
                            return resolve({"found": true});
                        } else {
                            console.log(_adSlot + " not found");
                            return resolve({"found": false});
                        }
                    }, 1000)
                })
            }, _adSlot);
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


