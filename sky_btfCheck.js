const puppeteer = require("puppeteer");

var url = 'https://www.bild.de/';

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

  describe('Puppeteer for AdTech', () => {
      
    it('Check AdSlot sky_btf', async function() {

    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
    })
    const page = await browser.newPage() 

    this.timeout(0);

    await page.setDefaultTimeout(0);


    await page.setViewport({ 
        //Desktop size
        width: 1920, 
        height: 1800, 
        });
    await page.goto(url);
    removeCmpLayer(page);


    // Check that the page min height has to be 5000px
    const htmlHeight = await page.evaluate(() => {

        return document.getElementById("__layout").offsetHeight;    
    });
    if (htmlHeight <= 5000){
        console.log(" ❌ Page's height is: " + htmlHeight + " minimum height of 5000px is not fulfilled; therefore, no enough place for two Sky slots.")
    }
    console.log("1) Page's height is: " + htmlHeight);

    if (htmlHeight > 5000){
        console.log(" ✅  Page's height is: " + htmlHeight + ". minimum height of 5000px is fulfilled; therefore, there is enough place for two Sky slots.")
    }

    //check skyPosition

//     const skyPosition = await page.evaluate(() => {

//         return document.getElementById("sky");    
//     });
//         let elem = document.querySelector('div');
//     let rect = elem.getBoundingClientRect();
//     for (var key in rect) {
//     if(typeof rect[key] !== 'function') {
//         let para = document.createElement('p');
//         para.textContent  = `${ key } : ${ rect[key] }`;
//         document.body.appendChild(para);
//     }
// }
// console.log("Page's height is: " + skyPosition);

    // load all sightloader slots
    //adSSetup = await page.evaluate("adSSetup");
    adSlots = ['sky',
    'sky_btf']
    console.log("adSlots array = ", adSlots)

   //1a. check if Sky is found in adSSetup DESKTOP
        
   for (var i = 0; i < adSlots.length; i++) {
       console.log("current slot ", adSlots[i])
       // check if slot exists
       var selector = adSlots[i];
       var slotFound = await page.evaluate( async (selector) => {
           var slot = document.getElementById(selector);
           return slot ? true : false
       }, selector);

       console.log("selector found ", slotFound)
       
       if (slotFound) {
           await ScrollAdslotIntoView(page, adSlots[i]);
           adSlotBuild = adSlots[i] + " ";
            
       } 
   }
   


    // //1a. SKY BTF in adSSetup DESKTOP
    

    // var addSlotsDesktop = "<h2>" + "Check AdSlots (Desktop)" + "</h2>"
    // var addSlotsDesktopFound = "<h3>" + "AdSlots found in adSSetup:" + "<h/3>" + "<ul>"
    // fs.appendFileSync('buildProtocol.html', addSlotsDesktop + addSlotsDesktopFound, err => {if (err) {console.error(err)}}); 
    
    // for (var i = 0; i < adSlots.length; i++) {
    //     console.log("current slot ", adSlots[i])
    //     // check if slot exists
    //     var selector = adSlots[i];
    //     var slotFound = await page.evaluate( async (selector) => {
    //         var slot = document.getElementById(selector);
    //         return slot ? true : false
    //     }, selector);

    //     console.log("selector found ", slotFound)
    //     // if slot exists - append to build.html
    //     if (slotFound == "sky_btf") {
    //         await ScrollAdslotIntoView(page, adSlots[i]);
    //         adSlotBuild = adSlots[i] + " ";
    //         console.log(adSlotBuild)  
    //     } 
    // }

    
    // //1b. SKY BTF NOT found in adSSetup  DESKTOP
    // var addSlotsDesktopNotFound = "<h3>" + "AdSlots missing on the page:" + "<h/3>" + "<ul>"
    // fs.appendFileSync('buildProtocol.html', addSlotsDesktopNotFound, err => {if (err) {console.error(err)}}); 

    // for (var i = 0; i < adSlots.length; i++) {
    //     var selector = adSlots[i];
    //     var slotFound = await page.evaluate( async (selector) => {
    //         var slot = document.getElementById(selector);
    //         return slot ? true : false
    //     }, selector);

    //     if (!slotFound) {
    //     fs.appendFileSync('buildProtocol.html', "<li>" + adSlots[i] + "</li>" , err => {if (err) {console.error(err)}});    
    //     } 
    // }
    
});
})