import Http from "deelzat/http";
import GetFeedProductsInput from "v2modules/product/inputs/get-feed-products.input";
import {formatDescription} from "modules/product/others/product-details.utils";
import store from 'modules/root/components/store-provider/store-provider';
const FeedApi = {};

FeedApi.getFeedProducts = async (inputs: GetFeedProductsInput) => {

    const blockedShopsIds = store.getState()?.blockedShops?.listIds || [];

    return new Promise((resolve, reject) => {
        Http.get('/app/home/products', inputs.query())
            .then(result => {

                let products = result?.products || [];
                products.forEach(product => {
                    product.body_html = formatDescription(product)?.body_html;
                    if (!product.shop) {
                        product.shop = {
                            id: product.shop_id,
                            name: product.shop_name,
                            picture: product.shop_picture
                        };
                    }
                })

                if (blockedShopsIds.length) {
                    products = products.filter(product => {
                        return !blockedShopsIds.includes(product?.shop?.id);
                    });
                }

                resolve(products);
            })
            .catch(reject);
    });
};

export default FeedApi;
