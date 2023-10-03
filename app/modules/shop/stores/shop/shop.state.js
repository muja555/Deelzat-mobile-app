function ShopStoreState() {
    this.isProfileCompleted = false;
    this.shopId = [];
    this.shopId = null;
    this.shop = null;
    this.deletedProductsIds = [];
    this.addedProduct = null;
    this.theme = null;
}

const shopInitialState = new ShopStoreState();
export default shopInitialState;
