// tests/specs/cart.spec.js
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
    
    // Add products to the cart
    for (const product of products) {
      await inventoryPage.addProductToCart(product);
    }
    
    // Verify cart badge shows correct count
    await expect(inventoryPage.cartBadge).toHaveText('3');
    
    // Go to cart
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
    
    // Add two products
    await inventoryPage.addProductToCart(productToRemove);
    await inventoryPage.addProductToCart(productToKeep);
    
    // Go to cart
    await inventoryPage.goToCart();
    
    // Remove one product
    await cartPage.removeItem(productToRemove);
    
    // Verify only one item remains
    const cartItems = await cartPage.getCartItemCount();
    expect(cartItems).toBe(1);
    
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain(productToKeep);
    expect(itemNames).not.toContain(productToRemove);
  });

  test('TC10: Continue shopping from cart', async ({ page }) => {
    // Positive scenario
    await inventoryPage.addProductToCart(testData.products.backpack);
    await inventoryPage.goToCart();
    
    // Go back to products
    await cartPage.continueShopping();
    
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  
});