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

  test('TC05: Add product to cart', async ({ page }) => {
    // Positive scenario
    const productName = testData.products.backpack;
    await inventoryPage.addProductToCart(productName);
    
    await expect(inventoryPage.cartBadge).toHaveText('1');
    
    // Verify the button changed to "Remove"
    const productItem = page.locator('.inventory_item', { hasText: productName });
    await expect(productItem.locator('button')).toHaveText('Remove');
  });

  test('TC06: Remove product from cart', async ({ page }) => {
    // Positive scenario
    const productName = testData.products.backpack;
    
    // Add then remove
    await inventoryPage.addProductToCart(productName);
    await inventoryPage.removeProductFromCart(productName);
    
    // Cart badge should not be visible
    await expect(inventoryPage.cartBadge).not.toBeVisible();
    
    const productItem = page.locator('.inventory_item', { hasText: productName });
    await expect(productItem.locator('button')).toHaveText('Add to cart');
  });

  test('TC07: Sort products by price (low to high)', async () => {
    // Positive scenario
    const pricesBeforeSort = await inventoryPage.getProductPrices();
    await inventoryPage.sortProducts('lohi');
    const pricesAfterSort = await inventoryPage.getProductPrices();
    // Convert prices to numbers and verify sorting
    const numericPricesBefore = pricesBeforeSort.map(p => parseFloat(p.replace('$', '')));
    const numericPricesAfter = pricesAfterSort.map(p => parseFloat(p.replace('$', '')));
    
    // Create sorted copy for comparison
    const expectedSorted = [...numericPricesBefore].sort((a, b) => a - b);
    
    expect(numericPricesAfter).toEqual(expectedSorted);
  });
});