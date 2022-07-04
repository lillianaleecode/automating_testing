'use strict';
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
            width: 1920, 
            height: 1800, 
        });

        await page.goto(url);
        removeCmpLayer(page);

        //item array to find: 
        const adSlots = ['sky',
            'sky_btf']
        console.log("adSlots array = ", adSlots)

        //1a. check if Sky is found in adSSetup DESKTOP       
        for (var i = 0; i < adSlots.length; i++) {
            console.log("current slot ", adSlots[i])
            
            var selector = adSlots[i];
            var slotFound = await page.evaluate( async (selector) => {
                var slot = document.getElementById(selector);
                return slot ? true : false
            }, selector);

            console.log("selector found ", slotFound)
        }

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

        // Check Sky_btf placement (should not be rendered earlier than 2500px from the top of the page)
        async function positionDOMElement(selector, padding = 0) {
            const rect = await page.evaluate(selector => {
            const element = document.querySelector(selector);
            const { x, y, width, height } = element.getBoundingClientRect();
            return { left: x, top: y, width, height, id: element.id };
            }, selector);
            console.log('rect: ', rect);

        }
            
        // call function (Rect position of DOM elements):
        await positionDOMElement('#sky_btf', 1);

       
        
    });

})