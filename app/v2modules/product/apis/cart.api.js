import Http from "deelzat/http";
import CreateUserCartInput from "v2modules/product/inputs/cart/create-user-cart.input";
import GetCartItemsInput from "v2modules/product/inputs/cart/get-cart-items.input";
import CreateCartItemInput from "v2modules/product/inputs/cart/create-cart-item.input";
import DeleteUserCartInput from "v2modules/product/inputs/cart/delete-user-cart.input";
import EditCartItemInput from "v2modules/product/inputs/cart/edit-cart-item.input";
import DeleteCartItemInput from "v2modules/product/inputs/cart/delete-cart-item.input";

const CartApi = {};


CartApi.getUserCarts = () => {
    return Http.get('/app/carts');
}

CartApi.createUserCart = (input: CreateUserCartInput) => {
    return Http.post('/app/carts', input.payload());
}

CartApi.deleteUserCart = (input: DeleteUserCartInput) => {
    return Http.delete(`/app/carts/${input.cartId}`);
}

CartApi.getCartItems = (input: GetCartItemsInput) => {
    return Http.get(`/app/carts/${input.cartId}/items`);
}

CartApi.createCartItem = (input: CreateCartItemInput) => {
    return Http.post(`/app/carts/${input.cartId}/items`, input.payload());
}

CartApi.editCarItem = (input: EditCartItemInput) => {
    return Http.put(`/app/carts/${input.cartId}/items/${input.cartItemId}`, input.payload());
}

CartApi.deleteCartItem = (input: DeleteCartItemInput) => {
    return Http.delete(`/app/carts/${input.cartId}/items/${input.cartItemId}`);
}


export default CartApi;

