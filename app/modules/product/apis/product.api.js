import Http from "deelzat/http";
import ProductClaimInput from "modules/product/inputs/product-claim.input";
import ProductStoreInput from "modules/product/inputs/product-store.input";
import ProductGetByHandleInput from "modules/product/inputs/product-get-by-handle.input";
import ProductDeleteInput from "modules/product/inputs/product-delete.input";
import ProductDetailsGetInput from "modules/product/inputs/product-details-get.input";
import {
    calculateProductsOverallPricesAndQuantity,
    calculateProductOverallPricesAndQuantity,
    attachQueryIDForProducts,
} from "modules/product/others/product-listing.utils";
import ProductsDetailsGetInput from "modules/product/inputs/products-details-get.input";

const ProductApi = {};

ProductApi.getByHandel = async (inputs: ProductGetByHandleInput) => {
    const apiPrefix = inputs.shopId?
        '/app/shop/' + inputs.shopId + '/product/' :
        '/app/products/handle/'
    return Http.get(apiPrefix + inputs.handle, inputs.query())
};

ProductApi.claim = async (inputs: ProductClaimInput) => {
    return Http.post('/app/claim', inputs.payload())
};

ProductApi.add = async (inputs: ProductStoreInput) => {
    return Http.post('/app/shop/' + inputs.shopId + '/product', inputs.payload())
};

ProductApi.delete = async (inputs: ProductDeleteInput) => {
    return Http.delete('/app/shop/' + inputs.shopId + '/product/' + inputs.productId, {});
};

ProductApi.update = async (inputs: ProductStoreInput) => {
    return Http.put('/app/shop/' + inputs.shopId + '/product/' + inputs.productId, inputs.payload())
};

ProductApi.getProductDetails = async (inputs: ProductDetailsGetInput, rejectOnEmpty = false) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await Http.get('/app/products/' + inputs.productID, {});
            if (result?.products?.length > 0) {
                result = calculateProductOverallPricesAndQuantity(result.products[0]);
                resolve(result);
            } else if (rejectOnEmpty){
                reject();
            } else {
                resolve({});
            }
        } catch (e) {
            reject(e)
        }
    });
};


ProductApi.getListProductsDetails = async (inputs: ProductsDetailsGetInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Http.get('/app/products/' + inputs.productIDs, {});
            let productsList = result?.products;
            if (productsList) {
                productsList = calculateProductsOverallPricesAndQuantity(productsList);
                productsList = attachQueryIDForProducts(productsList, result.algolia_query_id);
            }
            resolve(productsList);
        } catch (e) {
            reject(e);
        }
    });
};


export default ProductApi;
