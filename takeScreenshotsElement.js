const browser = await puppeteer.launch();

const page = await browser.newPage();
await page.goto('https://bild.de');

// get a list of all elements - same as document.querySelectorAll('*')
const elements = await page.$$('#mrec')

for (let i = 0; i < elements.length; i++) {
  try {
    // get screenshot of a particular element
    await elements[i].screenshot({path: `${i}.png`})
  } catch(e) {
    // if element is 'not visible', spit out error and continue
    console.log(`couldnt take screenshot of element with index: ${i}. cause: `,  e)
  }
}
await browser.close();
