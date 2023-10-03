import Http from "deelzat/http";
import map from "lodash/map";
import AlgoliaIndicesConst from "modules/main/constants/algolia-indices.const";
import algoliaSearch from "algoliasearch";
import Keys from "environments/keys";
import uniq from "lodash/uniq";
import GetShopByUsernameInput from "v2modules/shop/inputs/get-shop-by-username.input";
import GetAvailableUsernamesInput from "v2modules/shop/inputs/get-available-usernames.input";
import store from 'modules/root/components/store-provider/store-provider';
const ShopApi = {};

const algoliaSearchClient = algoliaSearch(Keys.Algolia.appId, Keys.Algolia.apiKey);

ShopApi.getShops = async (selectedCategory, selectedSubCategories, page, browseCountryCode) => {

    const pageSize = 20;
    const categoryId = selectedCategory?.objectID;
    const subCategoriesIds = map(selectedSubCategories, 'objectID');
    let queryParams = '';

    if(categoryId) {
        queryParams+= `&categories=${categoryId}`
    }

    if(subCategoriesIds.length === 1) {
        queryParams+= `&sub_categories=${subCategoriesIds[0]}`
    } else if(subCategoriesIds.length > 1){
        // queryParams+= `&sub_categories[]=`;
        subCategoriesIds.map((cat) => {
            queryParams += `&sub_categories[]=${cat},`
        });
        queryParams = queryParams.substring(0, queryParams.length - 1);
    }

    return new Promise((resolve, reject) => {
        (async () => {

            try {

                const result = await Http.get(`/app/shop/home?page=${page}${queryParams}&page_size=${pageSize}&country_code=${browseCountryCode}`);

                const blockedShopsIds = store.getState()?.blockedShops?.listIds || [];
                let filteredFromBlocked = result?.shops || [];

                if (blockedShopsIds.length) {
                    filteredFromBlocked = filteredFromBlocked?.filter(shop => {
                        return !blockedShopsIds.includes(shop.id);
                    });
                }

                const shopIds =  uniq((filteredFromBlocked || []).map(shop => shop.id));
                const algoliaRes = await ShopApi.getShopsById(shopIds);

                const shops = (filteredFromBlocked || []).map((shop) => {
                    const algoliaShop = algoliaRes.find(_s => _s.id === shop.id);
                    if (algoliaShop) {
                        shop.name = algoliaShop?.name;
                        if (shop.user) {
                            shop.user.picture = algoliaShop.picture;
                        }
                    }
                    return shop;
                });

                resolve(shops);

            } catch (e) {
                reject(e);
            }
        })();
    });
};


ShopApi.getShopsById = (ids) => {
    return new Promise(function(resolve, reject) {
        algoliaSearchClient
            .initIndex(AlgoliaIndicesConst.SHOPS)
            .browseObjects({
                filters: ids.map(id => (`"id" : "${id}"`)).join(" OR "),
                attributesToHighlight: [],
                attributesToSnippet: [],
                batch: resolve,
            })
            .catch(reject);
    })
}


ShopApi.getShopByUsername = async (inputs: GetShopByUsernameInput) => {
    return Http.get('/shops/username/' + inputs.username);
}


ShopApi.getSuggestionsForUsername = async (inputs: GetAvailableUsernamesInput) => {
    return Http.get('/shops/username/suggestions', inputs.query())
}


export default ShopApi;
