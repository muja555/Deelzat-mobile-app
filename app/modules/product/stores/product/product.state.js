import { getProductPriceOptions } from "modules/product/components/product-add/product-add.utils";

export function ProductStoreState() {
    return {
        category: null,
        subCategory: null,
        referenceCategory: null,
        images: [],
        target : null,
        fields: {},
        colors: [],
        size: null,
        priceMode: getProductPriceOptions()[0],
        isOutOfStockMode: false,
        variants: [],
        sizes: {},
        uploadedImages: [],
        trackSource: null
    }
}

const productInitialState = ProductStoreState();
export default productInitialState;
