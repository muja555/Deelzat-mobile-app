import { createStore, combineReducers, applyMiddleware } from 'redux'

import { appReducer } from "modules/main/stores/app/app.store";
import { authReducer } from "modules/auth/stores/auth/auth.store";
import { shopReducer } from "modules/shop/stores/shop/shop.store";
import { productReducer } from "modules/product/stores/product/product.store";
import { boardReducer } from "v2modules/board/stores/board.store";
import { cartReducer } from "modules/cart/stores/cart/cart.store";
import { chatReducer } from "modules/chat/stores/chat/chat.store";
import { checkoutReducer } from "v2modules/checkout/stores/checkout/checkout.store";
import { addressesReducer } from "v2modules/checkout/stores/addresses/addresses.store";
import homeShopsStatReducer from "v2modules/shop/stores/home-shops-stat/home-shops-stat.reducer";
import { persistentDataReducer } from "modules/main/stores/persistent-data/persistent-data.store";
import {geoReducer} from "v2modules/geo/stores/geo/geo.store";
import { composeWithDevTools } from 'redux-devtools-extension';
import { blockedShopsReducer } from 'v2modules/shop/stores/blocked-shops/blocked-shops.store';
import thunk from 'redux-thunk';

const reducers = {
    app: appReducer,
    auth: authReducer,
    shop: shopReducer,
    blockedShops: blockedShopsReducer,
    product: productReducer,
    board: boardReducer,
    cart: cartReducer,
    persistentData: persistentDataReducer,
    chat: chatReducer,
    homeShopsStat: homeShopsStatReducer,
    geo: geoReducer,
    checkout: checkoutReducer,
    addresses: addressesReducer,
};

const store = createStore(combineReducers(reducers), composeWithDevTools(applyMiddleware(thunk)));
export default store;
