// Create Html Protocol File
const fs = require('fs');
const puppeteer = require('puppeteer')

var url = 'https://www.bild.de/news/ausland/news-ausland/schweiz-iphone-rettet-abgestuerztem-snowboarder-das-leben-79683022.bild.html'




describe('Create HTML Test Protocol ', () => {
    it('HTML File Creation', async function() {

        

        const browser = await puppeteer.launch({
            headless: true,
            devtools: false,
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

//create html file        
        GenerateHtmlProtocol();
//Append opening HTML

        var addHtmlOpening = '<!DOCTYPE html>' + '<html lang="en">'+
        '<head>' + '<title>Test Protocol</title>'+'</head>' +
        '<body>';
        fs.appendFile('buildProtocol.html', addHtmlOpening, err => {if (err) {console.error(err)}});


//Append Title
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

        var addSource = "<h3>" + "testing source:" + "</h3>" + " " + "<p>" + url + "</p>"

        var addTitle = "<h1>" + "Test Protocol" + "</h1>" + "<br>" + "<h2>" + title + " - " + "</h2>" + addSource + "<br>"  ;
        fs.appendFile('buildProtocol.html', addTitle, err => {if (err) {console.error(err)}});

//get the current timestamp, "day-month-2022"
        const currentDate = new Date();
        const currentTime = currentDate.getHours() + ':' + currentDate.getMinutes();
        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const dateString = " " + currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear ;

        var addDate = "<p>" + "Date: " + dateString + " - " + currentTime + "</p>" +"<br>";

        fs.appendFile('buildProtocol.html', addDate, err => {if (err) {console.error(err)}});

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

//Append Adlib Version 
         GetVersion().toString();

//Append closing HTML
        var addHtmlClosing = '</body>'+ '</html>';
        fs.appendFile('buildProtocol.html', addHtmlClosing, err => {if (err) {console.error(err)}});
    

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
            // if slot exists - append to build.html
            if (slotFound) {
                await ScrollAdslotIntoView(page, adSlots[i]);

                adSlotBuild = adSlots[i] + " ";

                fs.appendFile('buildProtocol.html', adSlotBuild, err => {
                    if (err) {
                      console.error(err)
                      return
                    }
                    //done!
                  });
            } else {
                console.log("no slot for " + adSlots[i] + " found");
            }
        }

        ScrollAdslotIntoView();

    })
})
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function GenerateHtmlProtocol() {
    var fileName = 'buildProtocol.html';
    fs.createWriteStream(fileName);

    };

//puppeteer function to get Adlib Version
async function GetVersion() {
    const puppeteer = require('puppeteer');
    const fs = require('fs');
    const browser = await puppeteer.launch({
        headless: true, 
    })
    const page = await browser.newPage() 
    page.on('console', async (msg) => {
        
        if (msg._text.includes("alpha loaded")) {
            // console.log("msg from function GetVersion()1: Lilly check: "  + msg._text.slice(0,15))
            const addVersion = msg._text.slice(6,15);
            const addVersionConcat = "<h3>" + "Testing with Adlib version" + addVersion + " (development)" + "</h3>" + "<br>"
            // console.log( "msg from function GetVersion()2:" + addVersionConcat );
            fs.appendFile('buildProtocol.html', addVersionConcat, err => {if (err) {console.error(err)}})
        };
    });   
    await page.goto(url);
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