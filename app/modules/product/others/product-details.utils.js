import uniq from "lodash/uniq";
import uniqBy from "lodash/uniqBy";
import {getFullColorsPalette} from "modules/main/others/colors.utils";
import store from "modules/root/components/store-provider/store-provider";


const prepareProduct = (product, oldProduct) => {
    if (!product) {
        return;
    }

    const fields = store?.getState().persistentData?.fields;
    let processed = formatDescription(product)
    processed = substituteTagsNames(fields, processed)
    processed = generateSizeOptions(fields, processed)
    processed = generateColorOptions(processed)
    processed.blurhash = oldProduct?.blurhash;
    return processed
}

export {prepareProduct as prepareProduct}


const formatDescription = (product) => {
    if (!product) {
        return product
    }

    const _product = {... product}
    let _postText = _product.body_html || '';
    try {
        _postText = _postText.replace(/(\r\n|\r|\n){2}/g, '$1').replace(/(\r\n|\r|\n){3,}/g, '$1\n');
        _postText = _postText.trim();
    } catch (e) {
    }
    _product.body_html = _postText.length <= 3 ? '' : _postText

    return _product;
}

export {formatDescription as formatDescription}


/**
 * set a suitable name for each tag to be displayed as title in product details
 * @param fields from persistentDataSelectors.fieldsSelector
 */
const substituteTagsNames = (fields, product) => {
    if (!product)
        return product

    const _product = {...product}
    const productCategory = _product.sub_category || _product.category
    let fieldArr = productCategory?.fields || []
    fieldArr = fieldArr.map((item) => fields[item])
    _product.metafields = _product.metafields?.filter(metaField => metaField.key !== 'condition')
    _product.metafields?.forEach(tag => {
        if (tag.key === 'target') {
            tag.title = 'مناسب لِ'
        } else if (!tag.title) {
            const correspondingFilter = fieldArr.find(field => field?.name === `metafields.${tag.key}`)
            tag.title = correspondingFilter?.title
        }
    })

    return _product
}

export {substituteTagsNames as substituteTagsNames}


const getVariantsSizesName = (product) => {
    let sizesArr = (product?.variants || []).map(variant => variant.option2)
        .filter(str => !!str);
    if (sizesArr?.length > 0) {
        sizesArr = uniq(sizesArr);
    }
    return sizesArr;
}
export {getVariantsSizesName as getVariantsSizesName}


const generateSizeOptions = (fields, product) => {
    const optionsSize = getVariantsSizesName(product);
    const allSizes = Object.values(store.getState().persistentData.fields || [])
        .filter(field => field.categorey === 'size');
    if (optionsSize?.length > 0 && allSizes?.length > 0) {
        const _sizes = [];
        optionsSize.forEach(sizeValue => {
            allSizes.forEach((categorySize) => {
                categorySize.options.forEach((option) => {
                    if (option.value === sizeValue) {
                        _sizes.push({...option})
                    }
                })
            })
        })
        product.UIOptionsSize =  uniqBy(_sizes, 'value');
    }

    return product
}

export {generateSizeOptions as generateSizeOptions}

const getVariantsColorNames = (product) => {
    let colorsArr = (product?.variants || []).map(variant => variant.option1)
        .filter(str => !!str);
    if (colorsArr?.length > 0) {
        colorsArr = uniq(colorsArr);
    }
    return colorsArr;
}
export {getVariantsColorNames as getVariantsColorNames}


const generateColorOptions = (product) => {
    const FullColorsPalette = getFullColorsPalette();
    const _colors = []
    const colorsNames = getVariantsColorNames(product)
    if (colorsNames) {
        const colorsWithinVariants = (product.variants || []).map(variant => variant.option1)
        uniq(colorsWithinVariants).forEach((colorName) => {
            const color = FullColorsPalette.find((c) => c.title?.trim() === colorName?.trim());
            if (color) {
                _colors.push({...color});
            }
        });
    }
    product.UIOptionsColor = _colors;
    return product;
}

export {generateColorOptions as generateColorOptions}

