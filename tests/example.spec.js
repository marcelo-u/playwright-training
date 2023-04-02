// @ts-check
const { test, expect } = require('@playwright/test');

test('homepage has title and links to intro page', async ({ browser }) => {

  const ecommerceUrl = 'https://rahulshettyacademy.com/client'
  const username = 'marcelourreli81@gmail.com';
  const password = 'Test123!!';
  const productTitle = 'ZARA COAT 3';
  const couponCode = 'rahulshettyacademy';

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
  await couponTxt.type(couponCode);
  await couponSubmitBtn.click();

});
