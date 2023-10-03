import Keys from "environments/keys";
import algoliaSearch from 'algoliasearch';

const algoliaSearchClient = algoliaSearch(Keys.Algolia.appId, Keys.Algolia.apiKey);
const CategoryApi = {};

CategoryApi.list = async () => {
    return new Promise(function(resolve, reject) {
        algoliaSearchClient
            .initIndex('prod_categories')
            .browseObjects({
                facetFilters: ['published:true'],
                attributesToHighlight: [],
                attributesToSnippet: [],
                batch: (hits) => {
                    resolve(hits);
                },
            });
    });
};

export default CategoryApi;
