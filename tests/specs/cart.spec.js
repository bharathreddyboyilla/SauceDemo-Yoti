const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage = require('../pages/CartPage');
const testData = require('../fixtures/test-data.json');

test.describe('Cart Tests', () => {
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
  });

  test('TC8: Add multiple products to cart and verify', async () => {
    // Positive scenario
    const products = [
      testData.products.backpack,
      testData.products.bikeLight,
      testData.products.fleeceJacket
    ];
    
    for (const product of products) {
      await inventoryPage.addProductToCart(product);
    }
   
    await expect(inventoryPage.cartBadge).toHaveText('3');
    await inventoryPage.goToCart();
    // Verify all products are in cart
    const cartItems = await cartPage.getCartItemCount();
    expect(cartItems).toBe(3);
    const itemNames = await cartPage.getItemNames();
    for (const product of products) {
      expect(itemNames).toContain(product);
    }
  });

  test('TC9: Remove item from cart page', async () => {
    // Positive scenario
    const productToRemove = testData.products.backpack;
    const productToKeep = testData.products.bikeLight;

    await inventoryPage.addProductToCart(productToRemove);
    await inventoryPage.addProductToCart(productToKeep);
    await inventoryPage.goToCart();
    await cartPage.removeItem(productToRemove);
    //verifies rest of the items in cart
    const cartItems = await cartPage.getCartItemCount();
    expect(cartItems).toBe(1);
    
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain(productToKeep);
    expect(itemNames).not.toContain(productToRemove);
  });

  test('TC10: Continue shopping from cart', async ({ page }) => {
    await inventoryPage.addProductToCart(testData.products.backpack);
    await inventoryPage.goToCart();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  
});