const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const testData = require('../fixtures/test-data.json');

test.describe('Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC01: Successful login with standard user', async ({ page }) => {
    // Positive scenario
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC02: Failed login with locked out user', async ({ page }) => {
    // Negative scenario
    await loginPage.login(
      testData.users.locked.username,
      testData.users.locked.password
    );
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out.');
  });

  test('TC03: Failed login with invalid credentials', async ({ page }) => {
    // Negative scenario
    await loginPage.login(
      testData.users.invalid.username,
      testData.users.invalid.password
    );
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
  });

  test('TC04: Failed login with empty credentials', async ({ page }) => {
    // Negative scenario
    await loginPage.login(
      testData.users.empty.username,
      testData.users.empty.password
    );
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Username is required');
  });
});