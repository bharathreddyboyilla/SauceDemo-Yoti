const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage = require('../pages/CartPage');
const testData = require('../fixtures/test-data.json');

test.describe('API Validation Tests', () => {
  //const baseURL = testData.apiEndpoints.base;

  // Test Case 1: API Status Code Validation
  test.skip('TC-API01: Verify all endpoints return correct status codes', async ({ request }) => {
    const endpoints = [
      '/',
      '/inventory.html',
      '/cart.html',
      '/checkout-step-one.html',
      '/checkout-step-two.html',
      '/checkout-complete.html'
    ];

    for (const endpoint of endpoints) {
      const response = await request.get('/' + endpoint);
      console.log(`Testing ${endpoint}: ${response.status()}`);
      expect(response.status()).toBe(200);
    }
  });

  // Test Case 2: Inventory Data Validation
  test.skip('TC-API02: Verify inventory page loads product data', async ({ request }) => {
    const baseURL = '/';
     await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    const response = await request.get(`${baseURL}/inventory.html`);
    expect(response.status()).toBe(200);
    
    const body = await response.text();
    
    // Verify key elements exist in the HTML
    expect(body).toContain('inventory_container');
    expect(body).toContain('Sauce Labs');
    expect(body).toContain('add-to-cart');
  });

  // Test Case 3: Check API Headers
  test('TC-API03: Verify response headers and content type', async ({ request }) => {
    const response = await request.get('/');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(response.headers()).toHaveProperty('date');
    expect(response.headers()).toHaveProperty('server');
  });

  // Test Case 4: Performance Check - Response Time
  test('TC-API04: Verify API response time is acceptable', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`Response time: ${responseTime}ms`);
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
  });
});