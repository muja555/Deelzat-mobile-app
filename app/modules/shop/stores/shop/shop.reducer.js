import { createReducer, on } from "deelzat/store";
import * as Actions  from "./shop.actions"
import shopInitialState from "./shop.state";
import { calculateProductOverallPricesAndQuantity } from 'modules/product/others/product-listing.utils';

const shopReducer = createReducer(
    shopInitialState,
    [

        on(Actions.SetShopIds, (state,  { payload } ) => {
            return {
                ...state,
                shopIds: payload
            };
        }),

        on(Actions.SetShopId, (state,  { payload } ) => {
            return {
                ...state,
                shopId: payload
            };
        }),

        on(Actions.SetIsCompleted, (state,  { payload } ) => {
            return {
                ...state,
                isProfileCompleted: payload
            };
        }),

        on(Actions.SetShop, (state,  { payload } ) => {
            return {
                ...state,
                shop: payload
            };
        }),

        on(Actions.SetTheme, (state,  { payload } ) => {
            return {
                ...state,
                theme: payload
            };
        }),

        on(Actions.SetAddedProduct, (state,  { payload } ) => {

            let data;
            if (payload) {
                data = calculateProductOverallPricesAndQuantity(payload);
                data.image = data.image?.src;
                data.tags = [data.product_type];
                const dataMetaGlobal = data.metafields.find(meta => meta.key === 'condition');
                data.meta = {
                    global: {
                        condition: dataMetaGlobal?.value
                    }
                }
            }

            return {
                ...state,
                addedProduct: payload
            };
        }),

        on(Actions.AddDeletedProductsId, (state,  { payload } ) => {
            const deletedProductsIds = state.deletedProductsIds || [];
            deletedProductsIds.push(payload)
            return {
                ...state,
                deletedProductsIds: [...deletedProductsIds]
            };
        }),

    ]);

export default shopReducer;
