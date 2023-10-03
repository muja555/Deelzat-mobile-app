import FilterSectionTypeConst from "modules/browse/constants/filter-section-type.const";
import {getFullColorsPalette} from "modules/main/others/colors.utils";
import {getProductTargets} from "modules/product/components/product-add/product-add.utils";
import BrowseProductsRoutesConst from "modules/browse/constants/browse-products-routes.const";
import {compressString} from "modules/main/others/main-utils";
import I19n from 'dz-I19n';

const ProductTargetsOptions = getProductTargets();

const countFilters = (filters) => {

    let count = 0;
    Object.keys(filters).forEach(key => count+=filters[key].length)
    return count
}
export {countFilters as countFilters}


const getPriceRangeFilter = () => {
    const priceRanges = [
        {
            title: '0-25',
            value: [{attribute: 'price_range', operator: ':', value: '0:10'}, {attribute: 'price_range', operator: ':', value: '10:25'}],
            attribute: 'price'
        },
        {
            title: '25-50',
            value: [{attribute: 'price_range', operator: ':', value: '25:50'}],
            attribute: 'price'
        },
        {
            title: '50-100',
            value: [{attribute: 'price_range', operator: ':', value: '50:75'}, {attribute: 'price_range', operator: ':', value: '75:100'}],
            attribute: 'price'
        },
        {
            title: '100-200',
            value: [{attribute: 'price_range', operator: ':', value: '100:150'}, {attribute: 'price_range', operator: ':', value: '150:200'}],
            attribute: 'price'
        },
        {
            title: '200-300',
            value: [{attribute: 'price_range', operator: ':', value: '200:250'}, {attribute: 'price_range', operator: ':', value: '250:300'}],
            attribute: 'price'
        },
        {
            title: '300-400',
            value: [{attribute: 'price_range', operator: ':', value: '300:400'}],
            attribute: 'price'
        },
        {
            title: '400-500',
            value: [{attribute: 'price_range', operator: ':', value: '400:500'}],
            attribute: 'price'
        },
        {title: '+500', value: [{attribute: 'price', operator: '>=', value: '500'}], attribute: 'price'},
    ]

    return {
        title: I19n.t('السعر'),
        name: 'price',
        type: FilterSectionTypeConst.SELECT,
        options: priceRanges
    }
}
export {getPriceRangeFilter as getPriceRangeFilter}


const getSortOptions = () => {

    const sortOptions = [
        {
            title: I19n.t('السعر من الأعلى إلى الأقل'),
            value: 'desc',
            attribute: 'sort'
        },
        {
            title: I19n.t('السعر من الأقل إلى الأعلى'),
            value: 'asc',
            attribute: 'sort'
        }
    ];
    return {
        title: I19n.t('ترتيب حسب'),
        name: 'sort',
        type: FilterSectionTypeConst.SELECT,
        options: sortOptions
    }

}
export {getSortOptions as getSortOptions}


const getColorsFilter = () => {
    return {
        title: I19n.t('اللون'),
        name: 'color',
        type: FilterSectionTypeConst.COLORS,
        options: getFullColorsPalette().map(color => ({
            attribute: 'color',
            operator: ':',
            value: color.title,
            color: color.color,
        }))
    }
}
export {getColorsFilter as getColorsFilter}


const getTargetFilter = () => {

    return {
        title: I19n.t('الفئة'),
        name: 'target',
        type: FilterSectionTypeConst.SELECT,
        options: ProductTargetsOptions.map(target => ({
            attribute: 'target',
            operator: ':',
            value: target.label,
            title: target.nickName,
        }))
    }

}
export {getTargetFilter as getTargetFilter}


const insertWithTabFilters = (preSelectedFilters, routeName) => {
    let tabFilters
    if (routeName === BrowseProductsRoutesConst.NEW_PRODUCTS) {
        tabFilters = [[{
            attribute: 'metafields.condition',
            operator: ':',
            value: 'جديد',
        }]]
    }
    else if (routeName === BrowseProductsRoutesConst.USED_PRODUCTS){
        tabFilters = [[{
            attribute: 'metafields.condition',
            operator: ':',
            value: 'كالجديد',
        }, {
            attribute: 'metafields.condition',
            operator: ':',
            value: 'جيد',
        }]]
    }
    else {
        return preSelectedFilters
    }

    // remove pre selected conditions from external sources such as deeplinks, collection, banners
    // and replace with selected tab condition
    let _filters = preSelectedFilters || []
    _filters = _filters.filter(subFilters =>
         subFilters?.length && subFilters[0].attribute !== "metafields.condition")

    return tabFilters.concat(_filters)
}
export {insertWithTabFilters as insertWithTabFilters}


const generateDeeplinkDigest = (route, category, subCategory, preSelectedFilters = [], selectedFilters = {}) => {

    preSelectedFilters = preSelectedFilters || []

    if (category) {
        // remove all previous objects and set this already selected one:
        preSelectedFilters = preSelectedFilters.filter(subArray => subArray[0].attribute !== 'category');
        preSelectedFilters.push([{
            attribute: 'category',
            operator: ':',
            value: category.objectID
        }])

    }


    if (subCategory) {
        // remove all previous objects and set this already selected one:
        preSelectedFilters = preSelectedFilters.filter(subArray => subArray[0].attribute !== 'sub_category');
        preSelectedFilters.push([{
            attribute: 'sub_category',
            operator: ':',
            value: subCategory.objectID
        }])
    }

    /* remove other attributes to keep string as small as possible,
      just keep field.value and field.color to reflect selected filters on opening deeplink
    */
    let strippedSelectedFilters
    if (selectedFilters) {
        strippedSelectedFilters = {}
        Object.keys(selectedFilters).forEach(key => {
            strippedSelectedFilters[key] = selectedFilters[key].map(filter => {
                const stripped = {value: filter.value, operator: filter.operator, attribute: filter.attribute}
                if (filter.color)
                    stripped.color = filter.color
                return stripped
            })
        })
    }

    const digest = JSON.stringify({
        preSelectedFilters: preSelectedFilters,
        selectedFilters: strippedSelectedFilters,
        route: route,
    })

    return compressString(digest)
}
export {generateDeeplinkDigest as generateDeeplinkDigest}
