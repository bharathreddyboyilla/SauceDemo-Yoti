const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage = require('../pages/CartPage');
const testData = require('../fixtures/test-data.json');

test.describe('API Validation Tests', () => {
  test('TC-API01: Verify response headers and content type', async ({ request }) => {
    const response = await request.get('/');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(response.headers()).toHaveProperty('date');
    expect(response.headers()).toHaveProperty('server');
  });

  test('TC-API02: Verify API response time is acceptable', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`Response time: ${responseTime}ms`);
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(5000);
  });
});