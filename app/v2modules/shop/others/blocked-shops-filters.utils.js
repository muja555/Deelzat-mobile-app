import store from 'modules/root/components/store-provider/store-provider';
import AlgoliaIndicesConst from 'modules/main/constants/algolia-indices.const';

export function getSearchFilter(algoliaIndex) {

    const countryCode = store.getState().geo.browseCountryCode;

    let filterQuery = `country_codes : ${countryCode}`;

    const blockedShopsFilter = getSearchFilterByBlockedShops(algoliaIndex);
    if (blockedShopsFilter) {
        filterQuery = filterQuery + ' AND ' + blockedShopsFilter;
    }

    return filterQuery;
}


export function getSearchFilterByBlockedShops(algoliaIndex) {

    const blockedShopsIds = store.getState()?.blockedShops?.listIds || [];
    const filterByAttr = algoliaIndex === AlgoliaIndicesConst.SHOPS? 'id': 'named_tags.shop';

    let filterQuery = '';

    if (blockedShopsIds.length) {
        filterQuery = blockedShopsIds
            .map(shopId => `NOT ${filterByAttr} : ${shopId}`)
            .join(' AND ');
    }

    return filterQuery;
}



