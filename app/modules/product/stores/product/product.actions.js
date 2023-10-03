import { createAction } from "deelzat/store";


const SET_DATA = '[Product] Set Data';
export const SetData = createAction(
    SET_DATA
);


const SET_IMAGES = '[Product] Set Images';
export const SetImages = createAction(
    SET_IMAGES
);


const RESET_DATA = '[Product] Reset Data';
export const ResetData = createAction(
    RESET_DATA
);

const SET_FIELD = '[Product] Set Field';
export const SetField = createAction(
    SET_FIELD
);

const SET_VARIANT = '[Product] Set Variant';
export const SetVariant = createAction(
    SET_VARIANT
);

const SET_SIZES_OF = '[Product] Set Sizes Of';
export const SetSizesOf = createAction(
    SET_SIZES_OF
);

const SET_PRODUCT_DATA = '[Product] Set Product Data';
export const SetProductData = createAction(
    SET_PRODUCT_DATA
);

const SET_UPLOADED_IMAGES = '[Product] Set Uploaded Images';
export const setUploadedImages = createAction(
    SET_UPLOADED_IMAGES
);
