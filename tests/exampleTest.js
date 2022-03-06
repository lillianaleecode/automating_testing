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
        await browser.close() //close browser after finishing the script
    })
})

//to run this, we add this in the package.json
//to run this terminal: npm run test