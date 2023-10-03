export function CheckoutStoreState() {
    return {
        clearCartOnSuccess: false,
        checkoutItems: [] = [],
        selectedSavedAddress: null,
        buyerInfo: {},
        shippingInfo: {},
        coupon: null,
        addonsList: [],
        specialRequest: '',
        trackSource: {},
        session: null,
        cartId: null,
    }
}

const checkoutInitialState = new CheckoutStoreState();
export default checkoutInitialState;
