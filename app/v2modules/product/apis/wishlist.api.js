import Http from "deelzat/http";
import CreateUserWishlistInput from "v2modules/product/inputs/wishlist/create-user-wishlist.input";
import DeleteUserWishlistInput from "v2modules/product/inputs/wishlist/delete-user-wishlist.input";
import GetWishlistItemsInput from "v2modules/product/inputs/wishlist/get-wishlist-items.input";
import CreateWishlistItemInput from "v2modules/product/inputs/wishlist/create-wishlist-item.input";
import EditWishlistItemInput from "v2modules/product/inputs/wishlist/edit-wishlist-item.input";
import DeleteWishlistItemInput from "v2modules/product/inputs/wishlist/delete-wishlist-item.input";


const WishlistApi = {};


WishlistApi.getUserWishlists = () => {
    return Http.get('/app/wishlists');
}

WishlistApi.createUserWishlist = (input: CreateUserWishlistInput) => {
    return Http.post('/app/wishlists', input.payload());
}

WishlistApi.deleteUserWishlist = (input: DeleteUserWishlistInput) => {
    return Http.delete(`/app/wishlists/${input.wishlistId}`);
}

WishlistApi.getWishlistItems = (input: GetWishlistItemsInput) => {
    return Http.get(`/app/wishlists/${input.wishlistId}/items`);
}

WishlistApi.createWishlistItem = (input: CreateWishlistItemInput) => {
    return Http.post(`/app/wishlists/${input.wishlistId}/items`, input.payload());
}

WishlistApi.editWishlistItem = (input: EditWishlistItemInput) => {
    return Http.put(`/app/wishlists/${input.wishlistId}/items/${input.wishlistItemId}`, input.payload());
}

WishlistApi.deleteWishlistItem = (input: DeleteWishlistItemInput) => {
    return Http.delete(`/app/wishlists/${input.wishlistId}/items/${input.wishlistItemId}`);
}


export default WishlistApi;
