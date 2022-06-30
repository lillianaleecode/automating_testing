// Create Html Protocol File
const fs = require('fs');
const puppeteer = require('puppeteer')

var url = 'https://www.bild.de/regional/hamburg/hamburg-aktuell/ausbreitung-steigt-schon-49-affenpocken-faelle-in-hamburg-80554288.bild.html';

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// //Append Adlib Version 
// page.on('console', async (msg) => {
            
//     if (msg._text.includes("alpha loaded")) {
//         // console.log("msg from function GetVersion()1: Lilly check: "  + msg._text.slice(0,15))
//         const addVersion = msg._text.slice(7,15);
//         const addVersionConcat = "<h3>" + "Testing with Adlib version" + addVersion + " (development)" + "</h3>" 
//         // console.log( "msg from function GetVersion()2:" + addVersionConcat );
//         fs.appendFileSync('buildProtocol.html', addVersionConcat, err => {if (err) {console.error(err)}})
//     } else{

//     }
// });   



function GenerateHtmlProtocol() {
    var fileName = 'buildProtocol.html';
    fs.createWriteStream(fileName);

    };

async function removeCmpLayer(page){
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
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

describe('Create HTML Test Protocol ', () => {
    it('Check AdSlots', async function() {

        const browser = await puppeteer.launch({
            headless: false,
            devtools: false,
        })
        const page = await browser.newPage() 

        // Configure the navigation timeout
        this.timeout(0);

        // await page.goto(url, {
        //      timeout: 0
        //   });

        await page.setDefaultTimeout(0);

//create html file        
        GenerateHtmlProtocol();

//Append opening HTML
        var addHtmlOpening = '<!DOCTYPE html>' + '<html lang="en">'+
        '<head>' + '<title>Test Protocol</title> <link rel="stylesheet" href="style.css">'+'</head>' +
        '<body>';
        fs.appendFile('buildProtocol.html', addHtmlOpening, err => {if (err) {console.error(err)}});

        await page.setViewport({ 
            //Desktop size
            width: 1920, 
            height: 1800, 
            });
        await page.goto(url);
        removeCmpLayer(page);


        //Append Title
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

        var addSource = "<h3>" + "testing source:" + "</h3>" + " " + "<p>" + url + "</p>"

        var addTitle = "<h1>" + "Test Protocol" + "</h1>" + "<h2>" + title + " - " + "</h2>" + addSource   ;
        fs.appendFileSync('buildProtocol.html', addTitle, err => {if (err) {console.error(err)}});

        //get the current timestamp, "day-month-2022"
        const currentDate = new Date();
        const currentTime = currentDate.getHours() + ':' + currentDate.getMinutes();
        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const dateString = " " + currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear ;

        var addDate = "<p>" + "Date: " + dateString + " - " + currentTime + "</p>";

        fs.appendFileSync('buildProtocol.html', addDate, err => {if (err) {console.error(err)}});
   
// load all sightloader slots
        adSSetup = await page.evaluate("adSSetup");
        adSlots = adSSetup["adPlacements"];
        console.log("adSlots array = ", adSlots)

//1a. AdSlots found in adSSetup DESKTOP
        

        var addSlotsDesktop = "<h2>" + "Check AdSlots (Desktop)" + "</h2>"
        var addSlotsDesktopFound = "<h3>" + "AdSlots found in adSSetup:" + "<h/3>" + "<ul>"
        fs.appendFileSync('buildProtocol.html', addSlotsDesktop + addSlotsDesktopFound, err => {if (err) {console.error(err)}}); 
        
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
                fs.appendFileSync('buildProtocol.html',  "<li>" + adSlotBuild + "</li>", err => {if (err) {console.error(err)}});    
            } 
        }
        fs.appendFileSync('buildProtocol.html', "</ul>", err => {if (err) {console.error(err)}}); 
        
//1b. AdSlots NOT found in adSSetup  DESKTOP
        var addSlotsDesktopNotFound = "<h3>" + "AdSlots missing on the page:" + "<h/3>" + "<ul>"
        fs.appendFileSync('buildProtocol.html', addSlotsDesktopNotFound, err => {if (err) {console.error(err)}}); 

        for (var i = 0; i < adSlots.length; i++) {
            var selector = adSlots[i];
            var slotFound = await page.evaluate( async (selector) => {
                var slot = document.getElementById(selector);
                return slot ? true : false
            }, selector);

            if (!slotFound) {
            fs.appendFileSync('buildProtocol.html', "<li>" + adSlots[i] + "</li>" , err => {if (err) {console.error(err)}});    
            } 
        }
        fs.appendFileSync('buildProtocol.html', "</ul>", err => {if (err) {console.error(err)}}); 


//2a. AdSlots found in adSSetup Mobile
        
            
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');

        await page.setViewport({ 
            //Desktop size
            width: 414, 
            height: 896, 
            });

        await page.goto(url);
        removeCmpLayer(page);

        var addSlotsMobile = "<h2>" + "Check AdSlots (Mobile)" + "</h2>"
        var addSlotsMobileFound = "<h3>" + "AdSlots found in adSSetup:" + "<h/3>" + "<ul>"
        fs.appendFileSync('buildProtocol.html', addSlotsMobile + addSlotsMobileFound, err => {if (err) {console.error(err)}}); 
        
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
                fs.appendFileSync('buildProtocol.html', "<li>" + adSlotBuild + "</li>" , err => {if (err) {console.error(err)}});    
            } 
        }
        fs.appendFileSync('buildProtocol.html', "</ul>", err => {if (err) {console.error(err)}}); 

        
//2b. AdSlots NOT found in adSSetup  Mobile

        var addSlotsMobileNotFound = "<h3>" + "AdSlots missing on the page:" + "<h/3>"+ "<ul>"
        fs.appendFileSync('buildProtocol.html', addSlotsMobileNotFound, err => {if (err) {console.error(err)}}); 

        for (var i = 0; i < adSlots.length; i++) {
            var selector = adSlots[i];
            var slotFound = await page.evaluate( async (selector) => {
                var slot = document.getElementById(selector);
                return slot ? true : false
            }, selector);

            if (!slotFound) {
            fs.appendFileSync('buildProtocol.html', "<li>" + adSlots[i] + "</li>", err => {if (err) {console.error(err)}});    
            } 
        }
        fs.appendFileSync('buildProtocol.html', "</ul>", err => {if (err) {console.error(err)}}); 

   



    });

    it('Check Console Errors', async function() {
        //Puppeteer basic config
        const browser = await puppeteer.launch({
            headless: false, 
            devtools: true
        })
        const page = await browser.newPage() 
        //3. CHECK FOR CONSOLE ERRORS
        //DESKTOP
        await page.setViewport({ 
            //Desktop size
            width: 1920, 
            height: 1800, 
            });
        await page.goto(url);

        removeCmpLayer(page);

        fs.appendFileSync('buildProtocol.html',"<h2> Check for console errors: </h2>  <h3> Errors from Adlib (1): <h/3> ", err => {if (err) {console.error(err)}}); 

        const logs = [];
        let text = page.on('console', async (msg) => {
            var location = msg.location();
            var source = "unknown";
            if (typeof location == "object" && location.url != ""){
                source = location.url;
            }
            console.log("console." + msg._type + "(" + msg._text + "(")
            if (msg._type == "error"){
                fs.appendFileSync('buildProtocol.html',  "<li>" + msg._type +" "+ msg._text +  "</li>" , err => {if (err) {console.error(err)}});;

            }
        
        });

        for (let i = 0; i < logs.length; i++) {
                text +=  logs[i] }

    })

    it('Mediation Script Check', async function() {
        //Puppeteer basic config
                const browser = await puppeteer.launch({
                  headless: false, 
                  devtools: true
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
        
        //remove the cmp layer so that mediation script will render.
        //it is not working, as I need to remove the CMP manually :/ its like the page is rendering twice.
        
                async function removeCMP(){
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
                        // console.log(err);
                        // process.exit();
                    }
        
                }
        
                
                        
        
        //getting page response.

       fs.appendFileSync('buildProtocol.html',"<h2> Check for Mediation Source: </h2> ", err => {if (err) {console.error(err)}}); 
        
               
        
                
                page.on("response", async (response) => {
                    
                    if (response._request._resourceType == "script" && response._url.includes("https://www.asadcdn.com/adlib/libmodules/extensions/mediation") ) {
                      console.log(" ✅  Source of our own Mediation Script:" + await response._url);
        
                      fs.appendFileSync('buildProtocol.html',  "<li>" + " ✅  Source of our own Mediation Script:" + await response._url +  "</li>" , err => {if (err) {console.error(err)}})
                      
                    } 
                    
                    if (response._request._resourceType == "script" && response._url.includes("https://acdn.adnxs-simple.com/ast/mediation/") ) {
                      console.log(" ❌ Default version source from Xandr Mediation Script:" + await response._url);
        
                      fs.appendFileSync('buildProtocol.html',  "<li>" + " ❌ Default version source from Xandr Mediation Script:" + await response._url +  "</li>" , err => {if (err) {console.error(err)}})
        
                    }
                  });
        
                   await page.goto(url);  
                   await removeCMP();
                
            });
            



    
})

