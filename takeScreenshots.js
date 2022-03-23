// Taking Screenshots

const puppeteer = require('puppeteer')

var url = 'https://www.bild.de';



describe('Taking Screenshots', () => {
    it('screenshot', async function() {
        const browser = await puppeteer.launch({
            headless: false,
            devtools: true
        })
        const page = await browser.newPage() 

        await page.goto(url)
        
        await page.setViewport({ 
            width: 1300, 
            height: 2000, 
            //deviceScaleFactor: 1 
        });



        
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

  
        
    })
})

//to run this terminal: npm run test


