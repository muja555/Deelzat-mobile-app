// Grouping variants in the end result will decrease number of products from pageSize specified, so request more a bit
import store from "modules/root/components/store-provider/store-provider";
import get from "lodash/get";
import { getSearchFilterByBlockedShops } from 'v2modules/shop/others/blocked-shops-filters.utils';
import AlgoliaIndicesConst from 'modules/main/constants/algolia-indices.const';

const HIT_COUNT_FACTOR = 1.5;
const FIELDS_MAP = {
    "metafields.condition": "meta.global.condition",
    "NOT metafields.condition": "NOT meta.global.condition",
    "metafields.age": "meta.global.age",
    "size": "options.size",
    "color": "options.color",
    "target": "meta.global.target",
    "category": "meta.global.category",
    "sub_category": "meta.global.subCategory",
    "metafields.language": "meta.global.language",
};


interface PayloadParams {
    page: number;
    pageSize: number;
    category: {},
    subCategory: {},
    externalFilters: [],
    filters: {},
    countryCode: string,
}

const generatePayload = (params: PayloadParams) => {

    const payload = {};
    payload.page = (params.page || 1) - 1;
    payload.hitsPerPage = Math.ceil((params.pageSize || 10) * HIT_COUNT_FACTOR);
    payload.filters = [];

    if (params.countryCode) {
        payload.filters.push([{
            attribute: 'country_codes',
            operator: ':',
            value: params.countryCode
        }]);
    }

    if (params.category) {
        payload.filters.push([{
            attribute: 'category',
            operator: ':',
            value: params.category.objectID
        }]);
    }
    if (params.subCategory) {
        payload.filters.push([{
            attribute: 'sub_category',
            operator: ':',
            value: params.subCategory.objectID
        }]);
    }

    // Detach text (search term from filters) from the rest of filters to be assigned to payload
    const textFilter = params.externalFilters?.find(sub => sub[0].attribute === 'text');
    if (textFilter) {
        payload.text = textFilter[0].value
        params.externalFilters = params.externalFilters.filter(sub =>  sub[0].attribute !== 'text');
    }

    Object.keys(params.filters || {}).forEach(filterKey => {

        const priceKey = filterKey === 'price';
        const sortKey = filterKey === 'sort';

        /* remove all filters in externalFilters exists in the new filters
        to override their values */
        if (params.externalFilters) {
            params.externalFilters = params.externalFilters.map(subFilters => {

                const isAttributePrice = subFilters[0].attribute === 'price' || subFilters[0].attribute === 'price_range';
                if ((priceKey && isAttributePrice) || subFilters[0].attribute === filterKey) {
                    return [];
                }
                else {
                    return subFilters;
                }
            });
            // remove empty arrays
            params.externalFilters = params.externalFilters.filter(subFilters => subFilters?.length);
        }

        // convert the new filters to api syntax
        // [[A],[C,D]] => A and (C or D)
        if (sortKey) {
            payload.sort = params.filters.sort[0].value;
        }
        else if (priceKey) {
            let filterArray = [];
            params.filters[filterKey].forEach(
                selectedOption => filterArray = filterArray.concat(selectedOption.value)
            )
            payload.filters.push(filterArray);
        }
        else {
            payload.filters.push(params.filters[filterKey]);
        }
    })

    // add all to filters
    if (params.externalFilters) {
        payload.filters = payload.filters.concat(params.externalFilters);
    }

    // clean all filters
    payload.filters = payload.filters.map(subFilters => subFilters.map(sub => ({
        attribute: sub.attribute,
        operator: sub.operator,
        value: sub.value,
    })));
    payload.filtersQuery =  buildFilterQuery(payload.filters);
    payload.text = payload.text || '';

    return payload;

}

export {generatePayload as generatePayload}


function buildQueryStatement({ attribute, operator, filterValues }): string {
    if (!Array.isArray(filterValues)) {
        filterValues = [filterValues];
    }
    return filterValues.map(filterValue => {
        if (filterValue.includes(' ') || filterValue.includes(':')) {
            filterValue = `"${filterValue}"`;
        }
        return `${attribute} ${operator} ${filterValue}`;
    }).join(' OR ');
}


function buildFilterQuery(filtersArr: []): string {

    const categories = store?.getState().persistentData?.categories || [];
    const subCategories = store?.getState().persistentData?.subCategories || [];

    const queryStrings = filtersArr.map(filters => {
            return filters
                .map(filter => {
                    let attribute = get(FIELDS_MAP, filter.attribute, filter.attribute);
                    let filterValue = filter.value;
                    if (filter.attribute === 'category') {
                        let category = categories.find(category => category.objectID === filter.value);
                        filterValue = category?.all_titles ?? filterValue;
                    }
                    else if (filter.attribute === 'sub_category') {
                        let subCategory = subCategories[filter.value];
                        filterValue = subCategory?.all_titles ?? filterValue;
                    }
                    return buildQueryStatement({
                        attribute,
                        operator: filter.operator,
                        filterValues: filterValue
                    });
                }).join(" OR ");
        }
    );

    let finalQuery = queryStrings.join(" AND ");

    // Filter Blocked Shops
    const blockedShopsFilter = getSearchFilterByBlockedShops(AlgoliaIndicesConst.PRODUCTS);
    if (blockedShopsFilter) {
        finalQuery = finalQuery + ' AND ' + blockedShopsFilter;
    }

    return finalQuery;
}
