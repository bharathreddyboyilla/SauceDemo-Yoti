class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[name="continue-shopping"]');
    this.removeButtons = page.locator('button.cart_button');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async removeItem(itemName) {
    const item = this.page.locator('.cart_item', { hasText: itemName });
    await item.locator('button.cart_button').click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async getItemNames() {
    return await this.itemNames.allTextContents();
  }
}

module.exports = CartPage;