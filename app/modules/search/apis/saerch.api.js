import Keys from "environments/keys";
import algoliaSearch from 'algoliasearch';
import AlgoliaIndicesConst from "modules/main/constants/algolia-indices.const";
import {prepareProductHits} from "modules/product/others/product-listing.utils";
import store from "modules/root/components/store-provider/store-provider";
import { getSearchFilter } from 'v2modules/shop/others/blocked-shops-filters.utils';

const algoliaSearchClient = algoliaSearch(Keys.Algolia.appId, Keys.Algolia.apiKey);
const SearchApi = {};

SearchApi.search = async (searchText, pageNum = 0) => {
    const queries = [{
        indexName: AlgoliaIndicesConst.PRODUCTS,
        query: searchText,
        attributesToHighlight: [],
        attributesToSnippet: [],
        params: {
            hitsPerPage: 100,
            page: pageNum,
            clickAnalytics: true,
            filters: getSearchFilter(AlgoliaIndicesConst.PRODUCTS)
        }
    }, {
        indexName: AlgoliaIndicesConst.SHOPS,
        query: searchText,
        attributesToHighlight: [],
        attributesToSnippet: [],
        params: {
            hitsPerPage: 10,
            page: pageNum,
            filters: getSearchFilter(AlgoliaIndicesConst.SHOPS)
        }
    }];

    return new Promise(async (resolve, reject) => {

        const algoliaRes = await algoliaSearchClient
            .multipleQueries(queries)
            .catch(reject);

        const results = algoliaRes?.results || [];

        const productResults = results.find(result => result.index === AlgoliaIndicesConst.PRODUCTS);
        const productHits = prepareProductHits(productResults?.hits || [],  productResults?.queryID)

        const hits = {};
        hits[AlgoliaIndicesConst.SHOPS] = results.find(result => result.index === AlgoliaIndicesConst.SHOPS)?.hits;
        hits[AlgoliaIndicesConst.PRODUCTS] = productHits;

        resolve(hits);
    });
};

export default SearchApi;

