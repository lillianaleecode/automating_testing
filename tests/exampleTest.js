const puppeteer = require('puppeteer')

var url = 'https://www.bild.de';

async function run () {

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(url);
    
        const flashVariableName = await page.evaluate( () => {
            var start = document.documentElement.innerHTML.indexOf('ASCDP') //+ 'ASCDP '.length;
            var tempDoc = document.documentElement.innerHTML.substring(start);
            return  tempDoc;
        });
    
            //console.log(await page.evaluate( (flashVariableName) => flashVariableName ));
            console.log(await page.evaluate( (flashVariableName) => flashVariableName, flashVariableName ));
    
            await browser.close();
            console.log("Fin del testing!!!!!!")
        } catch(e){
            console.log("Error Occurred", e)
        }
    }
    
    run();

describe('Puppeteer for AdTech', () => {
    it('should lauch the browser', async function() {
        const browser = await puppeteer.launch({
            headless: false, 
            //slowMo: 50, 
            devtools: true
        })
        const page = await browser.newPage() 
       // await page.goto('https://code.berlin/en/')//go to the URL page
       // await page.waitForSelector('p') //find a p tag or throw an error

        await page.goto(url)
        const title = await page.title()
        const urlLink = await page.url()

        console.log('Title: ' + title)
        console.log('URL: ' + urlLink)

        const ads = await page.evaluate("adSSetup"); //retrieves the adSetup
        console.log(ads);

       // console.log(await page.evaluate(() => "bild.js"));

        
        
        //const adJsFile = await page.content('bild.js'); //retrieves the website but not the bild.js file..
       // console.log(adJsFile);


        //await page.goBack()
        //await page.waitFor(3000) //passing the amount of time i want to wait for
        //await page.reload() //reload browser
        await browser.close() //close browser after finishing the script
    })
})

//to run this, we add this in the package.json
//to run this terminal: npm run test

