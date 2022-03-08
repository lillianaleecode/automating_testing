const puppeteer = require('puppeteer')

describe('My First Puppeteer Test', () => {
    it('should lauch the browser', async function() {
        const browser = await puppeteer.launch({
            headless: false, 
            slowMo: 50, 
            devtools: true
        })
        const page = await browser.newPage() 
        await page.goto('https://code.berlin/en/')//go to the URL page
        await page.waitForSelector('p') //find a p tag or throw an error

        await page.goto('https://www.bild.de/')
        const title = await page.title()
        const url = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + url)

        //const getPTag = await page.$selector('p');
        //const getInnerHTMLProperty = await getPTag.getProperty('innerHTML');
        //console.log(getInnerHTMLProperty)

        const ads = await page.evaluate("adSSetup");
        console.log(ads);

        

    


        //await page.goBack()
        //await page.waitFor(3000) //passing the amount of time i want to wait for
        //await page.reload() //reload browser
        await browser.close() //close browser after finishing the script
    })
})

//to run this, we add this in the package.json
//to run this terminal: npm run test