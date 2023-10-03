import keyBy from "lodash/keyBy";
import {isEmptyValues} from "modules/main/others/main-utils";
import uniqueId from "lodash/uniqueId";
import ProductFieldTypeConst from "modules/product/constants/product-field-type.const";
import ProductPriceConst from "modules/product/constants/product-price.const";
import {getVariantsColorNames, getVariantsSizesName} from "modules/product/others/product-details.utils";
import {getProductPriceOptions, getProductTargets} from "modules/product/components/product-add/product-add.utils";
import {getFullColorsPalette} from "modules/main/others/colors.utils";
import store from "modules/root/components/store-provider/store-provider";
import uniq from "lodash/uniq";

const mapDataForUpdate = (params) => {

    const {
        product,
        categories,
        subCategories,
        fields,
    } = params;

    const ProductTargetsOptions  = getProductTargets();
    const ProductPriceOptions = getProductPriceOptions(true);
    const FullColorsPalette = getFullColorsPalette();

    const subCategoriesAsArray = [];
    Object.keys(subCategories).forEach((key) => {
        subCategoriesAsArray.push(subCategories[key]);
    });

    const fieldsAsArray = [];
    Object.keys(fields).forEach((key) => {
        fieldsAsArray.push(fields[key]);
    });

    const productMetaFieldsMap = keyBy(product.metafields, 'key');

    const data = {};

    data.id = product.id;
    data.shopId = product.shopId;
    data.productMetaFieldsMap = productMetaFieldsMap;

    if (!isEmptyValues(productMetaFieldsMap) && !isEmptyValues(productMetaFieldsMap['category'])) {
        const metaCategory = productMetaFieldsMap['category'];
        data.category = categories.find((item) => item.title === metaCategory.value);
    } else if (product.category) {
        data.category = product.category;
    } else if (product.tags) {
        data.category = getCategoryFromTags(product);
    }


    if (!data.category) {
        return;
    }

    if (!isEmptyValues(productMetaFieldsMap) && !isEmptyValues(productMetaFieldsMap['subCategory'])) {
        const metaSubCategory = productMetaFieldsMap['subCategory'];
        data.subCategory = subCategoriesAsArray.find((item) => item.title === metaSubCategory.value);
    } else if (product.sub_category) {
        data.subCategory = product.sub_category;
    } else {
        data.subCategory = getSubCategoryFromTags(product);
    }

    data.referenceCategory = data.subCategory || data.category;

    if (!isEmptyValues(productMetaFieldsMap) && !isEmptyValues(productMetaFieldsMap['target'])) {
        const metaTarget = productMetaFieldsMap['target'];
        data.target = ProductTargetsOptions.find((item) => item.label === metaTarget.value);
    } else if (product.tags) {
        data.target = getTargetFromTags(product);
    }

    data.images = product.images.map((image) => {
        return {
            id: uniqueId(['']),
            remote: true,
            data: {
                uri: image.src
            },
            imageSource: 'REMOTE'
        }
    });

    data.fields = {};
    data.fields.title = {
        key: "title",
        value: product.title || ''
    };
    data.fields.body_html = {
        key: "body_html",
        value: product.body_html || ''
    };

    fieldsAsArray.forEach((item) => {
        if (item.name.startsWith('metafields.')) {
            const name = item.name.split('metafields.').join('');
            if (productMetaFieldsMap && productMetaFieldsMap[name]) {
                const meta = productMetaFieldsMap[name];
                let value = null;
                if (item.type === ProductFieldTypeConst.TEXT_AREA || item.type === ProductFieldTypeConst.TEXT_FIELD) {
                    value = meta.value
                }
                else if (item.type === ProductFieldTypeConst.SELECT || item.type === ProductFieldTypeConst.RADIO) {
                    value = item.options.find((option) =>  option.title === meta.value);
                }
                else if (item.type === ProductFieldTypeConst.SELECT_MULTI) {
                    const titles = Array.isArray(meta.value)? meta.value :  meta.value.split(',');
                    value = titles.map((title) => item.options.find((o) => o.title === title ))
                }

                if (value) {
                    data.fields[item.name] = {
                        id: meta.id,
                        key: item.name,
                        value: value
                    };
                }

            }

        }
    });


    let priceMode =  ProductPriceOptions.find((option) => option.value === ProductPriceConst.FULL_PRICE);
    for (let variant of product.variants) {
        if (variant.compare_at_price === variant.price && parseFloat(variant.price) === 0) {
            priceMode = ProductPriceOptions.find((option) => option.value === ProductPriceConst.FREE);
        }
        else if (parseFloat(variant.compare_at_price) > 0) {
            priceMode = ProductPriceOptions.find((option) => option.value === ProductPriceConst.SALE);
            break;
        }
    }

    data.priceMode = priceMode;

    const colors = [];
    if (!!data.referenceCategory && !!data.referenceCategory.has_variance) {
        const colorsWithinVariants = (product.variants || []).map(variant => variant.option1);
        if (colorsWithinVariants?.length > 0) {
            uniq(colorsWithinVariants).forEach((colorName) => {
                const color = FullColorsPalette.find((c) => c.title?.trim() === colorName?.trim());
                if (color) {
                    colors.push(color);
                }
            });

        }
    }

    data.colors = colors;

    let categorySizes = [];
    if (!!data.referenceCategory && !!data.referenceCategory.size_fields && data.referenceCategory.size_fields.length) {
        categorySizes = data.referenceCategory.size_fields.map((id) => fields[id]);
        if (!!data.referenceCategory.has_target) {
            categorySizes = categorySizes.filter((item) => {
                return item.target.indexOf(data.target.label) > -1;
            })
        }
    }

    let size = null;
    if (categorySizes.length) {
        const optionsSize = getVariantsSizesName(product)
        if (optionsSize?.length > 0) {
            const sampleSize = optionsSize[0];
            categorySizes.forEach((categorySize) => {
                categorySize.options.forEach((option) => {
                    if (option.value === sampleSize) {
                        size = categorySize;
                    }
                })
            });
        }
    }


    const sizes = {};
    // multi color multi sizes
    if (size && colors.length) {

        colors.forEach((color) => {
            sizes[size.name + '@' + color.title] = [];
        });

        product.variants.forEach((variant) => {
            const _size = size.options.find((o) => o.value === variant.option2);
            if (_size) {
                sizes[size.name + '@' + variant.option1].push(_size);
            }
        });
    }
    // no color multi sizes
    else if (size && colors.length === 0) {
        sizes[size.name + '@NO_COLOR'] = [];
        product.variants.forEach((variant) => {
            const _size = size.options.find((o) => o.value === variant.option1);
            if (_size) {
                sizes[size.name + '@NO_COLOR'].push(_size);
            }
        });
    }

    data.size = size;
    data.sizes = sizes;

    const variants = [];
    product.variants.forEach((variant) => {
        variants.push({
            option1: (size && colors.length === 0) ? 'NO_COLOR' : variant.option1,
            option2: (size && colors.length === 0) ? variant.option1 : variant.option2,
            quantity: parseFloat(variant.inventory_quantity),
            price: parseFloat(priceMode?.value === ProductPriceConst.SALE? variant.compare_at_price: variant.price),
            price_sale: parseFloat(variant.price),
        })
    });

    let allVariantsZeroQuantity = true;
    variants.forEach((variant) => {
        if (variant.quantity !== 0) {
            allVariantsZeroQuantity = false;
        }
    })

    data.isOutOfStockMode = allVariantsZeroQuantity;
    data.variants = variants;

    return data;
}

export {mapDataForUpdate as mapDataForUpdate}


const getCategoryFromTags = (product) => {
    if (!product?.tags) {
        return;
    }

    let result;
    const state = store.getState();
    const categories = state.persistentData.categories;

    Object.values(product.tags).forEach((tag) => {
        categories.forEach((category) => {
            category.all_titles?.forEach((categoryTitle) => {
                if (categoryTitle === tag?.trim()) {
                    result = category;
                }
            })
        })
    });

    return result;
}



const getSubCategoryFromTags = (product) => {
    if (!product?.tags) {
        return;
    }

    let result;
    const state = store.getState();
    const subCategories = state.persistentData.subCategories;

    const subCategoriesAsArray = [];
    Object.keys(subCategories).forEach((key) => {
        subCategoriesAsArray.push(subCategories[key]);
    });

    Object.values(product.tags).forEach((tag) => {
        subCategoriesAsArray.forEach((sub) => {
            sub.all_titles?.forEach((subTitle) => {
                if (subTitle === tag?.trim()) {
                    result = sub;
                }
            })
        })
    });

    return result;
}



const getTargetFromTags = (product) => {
    if (!product?.tags) {
        return;
    }

    let result;
    const targets = getProductTargets();
    Object.values(product.tags).forEach((tag) => {
        targets.forEach((target) => {
            if (target.label === tag?.trim()?.replace('لل', 'ال')) {
                result = target;
            }
        })
    });

    return result;
}
