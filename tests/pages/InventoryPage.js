class InventoryPage {
  constructor(page) {
    this.page = page;
    this.productTitle = page.locator('.inventory_item_name');
    this.productImage = page.locator('.inventory_item_img img');
    this.productPrice = page.locator('.inventory_item_price');
    this.addToCartButtons = page.locator('button.btn_inventory');
    this.removeButtons = page.locator('button.btn_secondary');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('.product_sort_container');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async addProductToCart(productName) {
    const productItem = this.page.locator('.inventory_item', { hasText: productName });
    await productItem.locator('button.btn_inventory').click();
  }

  async removeProductFromCart(productName) {
    const productItem = this.page.locator('.inventory_item', { hasText: productName });
    await productItem.locator('button.btn_secondary').click();
  }

  async getCartItemCount() {
    const count = await this.cartBadge.textContent();
    return parseInt(count);
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortProducts(option) {
    await this.sortDropdown.selectOption(option);
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async getProductNames() {
    return await this.productTitle.allTextContents();
  }

  async getProductPrices() {
    return await this.productPrice.allTextContents();
  }
}

module.exports = InventoryPage;