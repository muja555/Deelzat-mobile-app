import { createSelector } from 'reselect';

const getProductState = (state) => state.product;
export const productStateSelector = createSelector(getProductState, (subState) => subState);

export const productCategorySelector = createSelector(getProductState, (subState) => subState.category);

export const productFieldsSelector = createSelector(getProductState, (subState) => subState.fields);

export const uploadedImagesStateSelector = createSelector(getProductState, (subState) => subState.uploadedImages);
