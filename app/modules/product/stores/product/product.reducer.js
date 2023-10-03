import { createReducer, on } from "deelzat/store";
import * as Actions  from "./product.actions"
import productInitialState, {ProductStoreState} from "./product.state";
import findIndex from "lodash/findIndex";

const productReducer = createReducer(
    productInitialState,
    [

        on(Actions.SetData, (state,  { payload } ) => {

            const newState = {
                ...state,
                ...payload
            };

            newState.referenceCategory = newState.subCategory || newState.category;

            return newState
        }),

        on(Actions.ResetData, (state,  { payload } ) => {
            return ProductStoreState();
        }),


        on(Actions.SetField, (state,  { payload } ) => {

            const newState = {
                ...state,
            };

            const field = newState.fields[payload.key] || payload;
            field.value = payload.value;

            newState.fields[payload.key] = field;
            newState.fields = { ...newState.fields };

            return newState;
        }),

        on(Actions.SetVariant, (state,  { payload } ) => {

            const newState = {
                ...state,
            };

            const index = findIndex(newState.variants,(item) => {
                return item.option1 === payload.option1 && item.option2 === payload.option2
            });

            if (index > -1) {
                newState.variants[index] = payload;
            }
            else {
                newState.variants.push(payload);
            }

            newState.variants = [...newState.variants];

            return newState;
        }),

        on(Actions.SetSizesOf, (state,  { payload } ) => {

            const newState = {
                ...state,
            };

            newState.sizes[payload.color] = payload.sizes;

            newState.sizes = { ...newState.sizes};


            return newState;
        }),

        on(Actions.SetProductData, (state,  { payload } ) => {

            return  {
                ...state,
                ...payload
            };
        }),


        on(Actions.setUploadedImages, (state,  { payload } ) => {
            return {
                ...state,
                uploadedImages: payload
            };
        }),

    ]);

export default productReducer;
