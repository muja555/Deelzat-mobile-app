import Keys from "environments/keys";
import algoliaSearch from 'algoliasearch';
import AlgoliaIndicesConst from "modules/main/constants/algolia-indices.const";

const algoliaSearchClient = algoliaSearch(Keys.Algolia.appId, Keys.Algolia.apiKey);
const PersistentDataApi = {};

PersistentDataApi.get = async () => {
    const queries = [
        {
            indexName: AlgoliaIndicesConst.COUNTRIES,
            attributesToHighlight: [],
            attributesToSnippet: [],
            facetFilters: [
                'is_active:true'
            ],
        },
        {
            indexName: AlgoliaIndicesConst.NEW_CITIES,
            params: {hitsPerPage: 100},
            attributesToHighlight: [],
            attributesToSnippet: [],
            facetFilters: [
                'is_active:true'
            ],
        },
        {
            indexName: AlgoliaIndicesConst.STATIC_CONTENT,
            attributesToHighlight: [],
            attributesToSnippet: [],
        },
    ]

    return new Promise(function(resolve, reject) {
        algoliaSearchClient.multipleQueries(queries).then(response => {
            const hits = {};

            if (response?.results) {
                response.results.forEach((result) => {
                    hits[result.index] = result.hits;
                })
            }

            resolve(hits);
        }).catch(reject);
    });
};


PersistentDataApi.getFaqs = async () => {
    return new Promise(function(resolve, reject) {
        algoliaSearchClient
            .initIndex(AlgoliaIndicesConst.FAQS)
            .browseObjects({
                attributesToHighlight: [],
                attributesToSnippet: [],
                batch: (hits) => {
                    resolve(hits);
                },
            });
    });
};


PersistentDataApi.getFields = () => {
    return new Promise(function(resolve, reject) {
        algoliaSearchClient
            .initIndex(AlgoliaIndicesConst.PROD_FIELDS)
            .browseObjects({
                attributesToHighlight: [],
                attributesToSnippet: [],
                batch: (hits) => {
                    resolve(hits);
                },
            });
    });
}


PersistentDataApi.getAddons = () => {
    return new Promise(function(resolve, reject) {
        algoliaSearchClient
            .initIndex(AlgoliaIndicesConst.ADDONS)
            .browseObjects({
                attributesToHighlight: [],
                attributesToSnippet: [],
                facetFilters: [
                    'published:true'
                ],
                batch: (hits) => {
                    resolve(hits);
                },
            });
    });
}

export default PersistentDataApi;


