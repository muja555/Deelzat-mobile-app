import GetProductsInput from "v2modules/product/inputs/get-products.input";
import AlgoliaIndicesConst from "modules/main/constants/algolia-indices.const";
import uniq from "lodash/uniq";
import filter from 'lodash/filter';
import ShopApi from "v2modules/shop/apis/shop.api";
import {
    isDiscountProduct,
    prepareProductHits
} from "modules/product/others/product-listing.utils";
import Keys from "environments/keys";
import algoliaSearch from "algoliasearch";

import { createInMemoryCache } from '@algolia/cache-in-memory';

const algoliaSearchClient = algoliaSearch(Keys.Algolia.appId, Keys.Algolia.apiKey, {responsesCache: createInMemoryCache()});

const ProductApi = {};

ProductApi.getProducts = async (inputs: GetProductsInput, requestOptions) => {

    const {
        withShops = true,
        isJustDiscounts = false,
        log = false,
    } = requestOptions;

    const payload = inputs.payload();
    const indexName = payload.sort? (payload.sort === 'asc' ? AlgoliaIndicesConst.PRODUCTS_ASC : AlgoliaIndicesConst.PRODUCTS_DESC) : AlgoliaIndicesConst.PRODUCTS;
    return new Promise((resolve, reject) => {
       algoliaSearchClient
            .initIndex(indexName)
            .search(payload.text,{
                hitsPerPage: payload.hitsPerPage,
                page: payload.page,
                filters: payload.filtersQuery,
                clickAnalytics: true,
                attributesToHighlight: [],
                attributesToSnippet: [],
            })
            .then(resolve)
            .catch(reject)
        })
        .then((result) => {

            let output = result.hits || [];

            if (isJustDiscounts) {
                output = filter(output, isDiscountProduct);
            }
            output = prepareProductHits(output, result.queryID);
            return output;
        })
        .then((list) => Promise.all([
            // withBlur? generateBlurHashesForProducts(list): [],
            [],
            withShops? getShopsForProducts(list):  ({products: list, shops: []}),
        ]))
        .then(([productsWithHash, {products, shops}]) => {
            return products.map(product => {
                const hash = productsWithHash.find(p => p.objectID === product.objectID)?.blurhash;
                const shop = shops.find(_shop => _shop.id === product.named_tags?.shop);
                product.blurhash = hash || product.blurhash;
                product.shop = shop || product.shop;
                return product;
            })
        });
};


ProductApi.clearCache = async () => {
    return algoliaSearchClient.clearCache();
}

export default ProductApi;


function getShopsForProducts(products) {
    return new Promise((resolve, reject) => {
        let shopIds = uniq(products, 'named_tags.shop')
            .filter(product => !product.shop)
            .map(product => product.named_tags?.shop)
            .filter(t => !!t);
        shopIds = uniq(shopIds);
        if (shopIds.length) {
            ShopApi.getShopsById(shopIds)
                .then((shops) => resolve({products, shops}))
                .catch(reject)
        }
        else {
            resolve({products, shops: []});
        }
    });
}
