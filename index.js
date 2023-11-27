const puppeteer = require('puppeteer');

const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/');

  const Tempo = 5000; // milliseconds
  const selector = '._aano';
  


  // Scroll down the page for 4 seconds



  // Wait for the page to load
  await page.waitForTimeout(4000);

  await page.type('input[name="username"]', 'user');
  await page.waitForTimeout(2000);

  // Enter the password
  await page.type('input[name="password"]', 'pass');
  await page.waitForTimeout(3000);

  // Click the "Entrar" button
  const el =  await page.waitForXPath("//div[contains(text(), 'Entrar')]");
  await el.click();


  await page.waitForTimeout(5000);

  await page.goto('https://www.instagram.com/viniciu.s/');

  await page.waitForTimeout(6000);

  // Click the "seguidores" button
  await page.waitForXPath("//a[contains(text(), ' seguidores')]");
  const [followersLink2] = await page.$x("//a[contains(text(), ' seguidores')]");
  await followersLink2.click();
  await page.waitForTimeout(2000);



  let timeElapsed = 0;
  
  while (timeElapsed < Tempo) {

    // scroll selector into view
    await page.evaluate(selector => {
    const element = document.querySelector(selector);
    if ( element ) {
      element.scrollTo(element.offsetHeight, element.offsetHeight*element.offsetHeight);
    } else {
      console.error(`cannot find selector ${selector}`);
    }
    }, selector);

    await page.waitForTimeout(1000);
    timeElapsed += 1000;
    console.log(timeElapsed);    

  }

  // Extract data from the followers list
  const followers = await page.$$('.xuxw1ft');
  var followersData = "";

  for (var i=0; i < followers.length; i+=2) {
    const seguidor = followers[i]
    const seguidorText = await seguidor.evaluate((el) => el.textContent.trim());
    if(i!=0){
    followersData += `"${seguidorText}",`;
    }
  }

  console.log('Seguidores:', followersData);


  //fechar botao do modal
  await page.evaluate(() => {document.querySelector("._ac7b ._abm0").click() });


  // Click the "seguidores" button
  await page.waitForXPath("//a[contains(text(), ' seguindo')]");
  const [followingLink] = await page.$x("//a[contains(text(), ' seguindo')]");
  await followingLink.click();
  await page.waitForTimeout(2000);

  
  let timeElapsedFollowing = 0;


  while (timeElapsedFollowing < Tempo) {

    // scroll selector into view
    await page.evaluate(selector => {
    const element = document.querySelector(selector);
    if ( element ) {
      element.scrollTo(element.offsetHeight, element.offsetHeight*element.offsetHeight);
    } else {
      console.error(`cannot find selector ${selector}`);
    }
    }, selector);

    await page.waitForTimeout(1000);
    timeElapsedFollowing += 1000;
    console.log(timeElapsedFollowing);    

  }
  

  
  // Extract data from the followers list
  const following = await page.$$('.xuxw1ft');
  var followingData = "";

  for (var i=0; i < following.length; i+=2) {
    const seguindo = following[i]
    const seguindoText = await seguindo.evaluate((el) => el.textContent.trim())
    if(i!=0){
    followingData += `"${seguindoText}",`;
    }
  }

  console.log('Seguindo:', followingData);


  newdata = [followersData, followingData];

  fs.writeFile("Seguidores.csv", String(followersData), {encoding: "utf8"}, (err) => err && console.error(err));
  fs.writeFile("Seguindo.csv", String(followingData), {encoding: "utf8"}, (err) => err && console.error(err));

  // Keep the browser open
  console.log('Finished!');
})();
