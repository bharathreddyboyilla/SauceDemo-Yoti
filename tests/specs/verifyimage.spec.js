const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const testData = require('../fixtures/test-data.json');


test.describe('Product Tests', () => {
  let loginPage, inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    
    await loginPage.navigate();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
  });

test('TC14: Verify product images load correctly', async ({ page }) => {
  // Test data - product titles and what their images shows
  const expectedProducts = [
    { title: 'Sauce Labs Backpack', imageShouldContain: 'backpack' },
    { title: 'Sauce Labs Bike Light', imageShouldContain: 'bike-light' },
    { title: 'Sauce Labs Bolt T-Shirt', imageShouldContain: 'bolt' },
    { title: 'Sauce Labs Fleece Jacket', imageShouldContain: 'pullover' },
    { title: 'Sauce Labs Onesie', imageShouldContain: 'onesie' },
    { title: 'Test.allTheThings() T-Shirt (Red)', imageShouldContain: 'red' }
  ];

  for (const expected of expectedProducts) {
    const productItem = page.locator('.inventory_item', { hasText: expected.title });
    
    // Getting the image
    const image = productItem.locator('img');
    const altText = await image.getAttribute('alt');
    const imageSrc = await image.getAttribute('src');
    
    console.log(`\nChecking: ${expected.title}`);
    console.log(`  Alt: ${altText}`);
    console.log(`  Image URL: ${imageSrc}`);
    
    expect(altText).toBe(expected.title);
    const naturalWidth = await image.evaluate(el => el.naturalWidth);
    //expect(naturalWidth).toBeGreaterThan(0);
    
    //image filename contains expected keyword
    if (imageSrc) {
        const containsExpected = imageSrc.includes(expected.imageShouldContain);
        console.log(`Image contains '${expected.imageShouldContain}'? ${containsExpected}`);
        
        //Test should passes if true, fails if false
        expect(imageSrc).toContain(expected.imageShouldContain);
    }
  }
});
});