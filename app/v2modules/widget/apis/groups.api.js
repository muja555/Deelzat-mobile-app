import algoliaSearch from "algoliasearch";
import Keys from "environments/keys";
import GroupsInput from "v2modules/widget/inputs/groups.input";
import AlgoliaIndicesConst from "modules/main/constants/algolia-indices.const";
const GroupsApi = {};

const algoliaSearchClient = algoliaSearch(Keys.Algolia.appId, Keys.Algolia.apiKey);

GroupsApi.getItems = async (inputs: GroupsInput) => {
    return new Promise(function(resolve, reject) {
        const payload = inputs.payload();
        algoliaSearchClient
            .initIndex(AlgoliaIndicesConst.GROUPS)
            .search('',{
                hitsPerPage: 60,
                facetFilters: payload.facetFilters,
                tagFilters: payload.tagFilters,
                filters: payload.filters,
                attributesToHighlight: [],
            }).then((res) => resolve(res.hits));
    })
};

export default GroupsApi;
