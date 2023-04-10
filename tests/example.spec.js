// @ts-check
const { test, expect } = require('@playwright/test');

test('homepage has title and links to intro page', async ({ browser }) => {

  const ecommerceUrl = 'https://rahulshettyacademy.com/client'
  const username = 'marcelourreli81@gmail.com';
  const password = 'Test123!!';
  const productTitle = 'ZARA COAT 3';
  const couponCode = 'rahulshettyacademy';
  const autoSuggestCountry = 'arg'
  const country = ' Argentina'

  const context = await browser.newContext();
  const page = await context.newPage();

  const userNameBtn = page.locator('#userEmail');
  const passwordBtn = page.locator('#userPassword')
  const loginBtn = page.locator('#login')
  const addToShoppingCartBtn = 'text= Add to Cart';
  const shoppingCartBtn = page.locator('[routerlink="/dashboard/cart"]')
  const checkoutBtn = page.locator('text=Checkout')
  const couponTxt = page.locator('[name="coupon"]')
  const couponSubmitBtn = page.locator('[type="submit"]')
  const selectCountry = page.locator('[placeholder="Select Country"]')
  const suggestionList = page.locator('.ta-results');
  const suggestionItems = page.locator('.ta-results .ta-item')
  const emailInputText = page.locator('div .user__name input');

  const addToShoppingCart = async(row) => {
    await row.locator(addToShoppingCartBtn).click();
  }

  const productCards = page.locator('.card-body');

  //page  
  await page.goto(ecommerceUrl)

  //login credentials
  await userNameBtn.type(username)
  await passwordBtn.type(password);
  await loginBtn.click();

  //look for content
  await page.waitForLoadState('networkidle');
  const productsCount = await productCards.count();
  let found = false;
  
  for (const row of await productCards.all()) {
     if (await row.locator('b').textContent() === productTitle.toLowerCase()) {
      await addToShoppingCart(row)
      found = true;
      break;
     }
  }
  //expect(found, {message: "Product not found"}).toBeTruthy()
  await shoppingCartBtn.click();

  //replaced by waitFor()
  //await page.waitForLoadState('networkidle');

  //alternative for page.waitForLoadState('');
  await page.locator("div ul li").first().waitFor();
  const productAdded = await page.locator("h3:has-text('"+ productTitle + "')").isVisible()
  expect(productAdded, {message: "Product was not added in the shopping cart"}).toBeTruthy();


  await checkoutBtn.click();
  await selectCountry.type("arg", {delay: 500});
  await suggestionList.waitFor();
  found = false;
  for (const row of await suggestionItems.all()) {
    if (await row.textContent() === country) {
      await row.click();
      found = true;
      break;
    }
  }
  expect(found, {message: "Suggestion not found"}).toBeTruthy();

  console.log("MAIL???" + await emailInputText.nth(0).textContent());

  expect (await emailInputText.nth(0).textContent()).toBe(username);

  await couponTxt.type(couponCode);
  await couponSubmitBtn.click();

});


test.only("going back and forth", async({page}) => {

  const textInput = page.locator('#displayed-text');
  const hideBox = page.locator('#hide-textbox');

  const url = 'https://rahulshettyacademy.com/AutomationPractice/';
  await page.goto(url);
  //await page.goto('http://google.com');
  //await page.goBack();
  //await page.goForward();
  await expect(textInput).toBeVisible();
  await hideBox.click();
  await expect(textInput).toBeHidden();


})
