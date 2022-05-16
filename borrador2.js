
// Get Console messages from the Web
const puppeteer = require('puppeteer')
var url = 'https://m.bild.de/sport/mehr-sport/boxen/heute-bei-bild-im-tv-ab-22-uhr-die-grosse-doku-ueber-felix-sturm-79503584.bildMobile.html###wt_ref=https%3A%2F%2Fwww.bild.de%2Fvideo%2Fmediathek%2Fvideo%2Fbild-live-71144736.bild.html&wt_t=1652095830144';


describe('Puppeteer for AdTech', () => {
    it('lauching the browser', async function() {
        const browser = await puppeteer.launch({
            headless: false, 
        })
        const page = await browser.newPage() 


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

        await listenPageErrors(page)

        await page.goto(url)
 
    })
})



const listenPageErrors = async (page) => {
  
  // make args accessible
  const describe = (jsHandle) => {
    return jsHandle.executionContext().evaluate((obj) => {
      // serialize |obj|
      return `OBJ: ${typeof obj}, ${obj}`;
    }, jsHandle);
  }

  page.Console += async (sender, args) =>
{
    switch (args.Message.Type)
    {
        case ConsoleType.Error:
            try
            {
                var errorArgs = await Task.WhenAll(args.Message.Args.Select(arg => arg.ExecutionContext.EvaluateFunctionAsync("(arg) => arg instanceof Error ? arg.message : arg", arg)));
            
            }
            catch { }
            break;
        case ConsoleType.Warning:
            _logger.LogWarning(args.Message.Text);
            break;
        default:
            _logger.LogInformation(args.Message.Text);
            break;
    }
};

  // listen to browser console there
  page.on('console', async (message) => {
    const args = await Promise.all(message.args().map(arg => describe(arg)));
    const type = message.type().substr(0, 3).toUpperCase();
    let text = '';
    for (let i = 0; i < args.length; ++i) {
      text += `[${i}] ${args[i]} `;
    }
    console.log(`CONSOLE.${type}: ${message.text()}\n${text} `);
  });

  
}
