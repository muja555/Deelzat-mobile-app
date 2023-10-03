import Keys from 'environments/keys';
import algoliaSearch from 'algoliasearch';
import Http from 'deelzat/http';
import GetCheckoutSessionInput from 'v2modules/checkout/inputs/get-checkout-session.input';

const algoliaSearchClient = algoliaSearch(Keys.Algolia.appId, Keys.Algolia.apiKey);
const CheckoutDataApi = {};

CheckoutDataApi.getCheckoutData = async (inputs: GetCheckoutSessionInput) => {
   return Http.post('/app/v2/orders/checkout', inputs.payload());
};


CheckoutDataApi.getAddonsList = async () => {
    return new Promise(function(resolve, reject) {
        algoliaSearchClient
            .initIndex('addons')
            .browseObjects({
                batch: (hits) => {
                    resolve(hits);
                },
                facetFilters: [
                    'published:true',
                ],
            });
    });
};

export default CheckoutDataApi;
