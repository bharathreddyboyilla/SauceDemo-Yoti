// tests/specs/checkout.spec.js
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage = require('../pages/CartPage');
const testData = require('../fixtures/test-data.json');

test.describe('Checkout Tests', () => {
  let loginPage, inventoryPage, cartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    await loginPage.navigate();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    
    // Add a product and go to cart for checkout tests
    await inventoryPage.addProductToCart(testData.products.backpack);
    await inventoryPage.goToCart();
  });

  test('TC12: Complete checkout with valid information', async ({ page }) => {
    // Positive scenario
    await cartPage.proceedToCheckout();
    
    // Fill checkout information
    await page.locator('[data-test="firstName"]').fill(testData.checkoutInfo.valid.firstName);
    await page.locator('[data-test="lastName"]').fill(testData.checkoutInfo.valid.lastName);
    await page.locator('[data-test="postalCode"]').fill(testData.checkoutInfo.valid.postalCode);
    await page.locator('[data-test="continue"]').click();
    
    // Verify overview page
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
    await expect(page.locator('.cart_item')).toBeVisible();
    
    // Complete purchase
    await page.locator('[data-test="finish"]').click();
    
    // Verify completion
    await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('TC13: Checkout with empty information', async ({ page }) => {
    // Negative scenario
    await cartPage.proceedToCheckout();
    
    // Try to continue without filling information
    await page.locator('[data-test="continue"]').click();

    // Verify error message
    const errorMessage = page.locator('.error-message-container.error');
    await expect(errorMessage).toBeVisible('Error: First Name is required');
    
  });

  test('TC14: Cancel checkout process', async ({ page }) => {
    // Positive scenario
    await cartPage.proceedToCheckout();
    
    // Cancel from information page
    await page.locator('[data-test="cancel"]').click();
    
    // Should return to cart page
    await expect(page).toHaveURL(/cart.html/);
    await expect(page.locator('.title')).toHaveText('Your Cart');
  });
});