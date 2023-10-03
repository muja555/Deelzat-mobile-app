//@flow
import HrcInput from "deelzat/types/Input";
import {generatePayload} from "./product.input.utils";
import store from "modules/root/components/store-provider/store-provider";
export default class GetProductsInput extends HrcInput {

    externalFilters // from external sources such as collections, banners ...
    category
    subCategory

    filters: {} // which generated from filters screen,
    page: number
    pageSize: number
    countryCode: string
    filterByCountryCode = true;

    log: false;

    constructor() {
        super();
    }

    payload() {

        const countryCode = store.getState().geo.browseCountryCode;
        const payload = generatePayload({
            page: this.page,
            pageSize: this.pageSize,
            filters: this.filters,
            externalFilters: this.externalFilters,
            category: this.category,
            subCategory: this.subCategory,
            countryCode: this.filterByCountryCode? this.countryCode || countryCode: undefined,
        });

        if (this.log) {
            console.log("get-products.input.js " + "payload", JSON.stringify(payload))
        }

        return payload;
    }

}
