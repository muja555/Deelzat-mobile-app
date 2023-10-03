//@flow
import HrcInput from "deelzat/types/Input";
import ProductPriceConst from "modules/product/constants/product-price.const";
import ProductVariantModeConst from "modules/product/constants/product-variant-mode.const";

export default class ProductStoreInput extends HrcInput{

    // route
    shopId: number;
    shopName: string;
    productId: string;

    uploadedImages: [];

    productState: {};
    allFields: {};


    overrideEmptyDescription: boolean;


    constructor() {
        super();
    }

    payload() {

        const product = this.productState;
        const referenceCategory = this.productState.referenceCategory;
        const allFields = this.allFields;
        const uploadedImages = this.uploadedImages;

        const referenceCategoryFields = referenceCategory.fields.map((item) => {
           return allFields[item];
        });


        const payload = {};

        payload.published = true;
        payload.vendor = this.shopName;
        payload.product_type = referenceCategory.title;
        payload.title = product.fields.title.value;
        payload.body_html = product.fields.body_html.value;
        if (this.overrideEmptyDescription) {
            payload.body_html ||= ' ';
        }

        payload.images = [];

        uploadedImages.forEach((image, index) => {
            payload.images.push({
                position: index + 1,
                src: image.remoteUrl
            })
        });

        payload.metafields = [];

        payload.metafields.push({
            id: product?.productMetaFieldsMap?.category?.id,
            key: 'category',
            value: product.category.title
        });

        if (product.subCategory && product.subCategory.title) {
            payload.metafields.push({
                id: product?.productMetaFieldsMap?.subCategory?.id,
                key: 'subCategory',
                value: product.subCategory.title
            });
        }

        if (referenceCategory.has_target) {
            payload.metafields.push({
                id: product?.productMetaFieldsMap?.target?.id,
                key: 'target',
                value: product.target.label
            });
        }

        referenceCategoryFields.forEach((item) => {

            const field = product.fields[item.name];

            if (field && field.key.startsWith('metafields.')) {

                const key = field.key.split('metafields.').join('');
                let fieldValue = field.value;

                let value = fieldValue;
                if (Array.isArray(fieldValue)) {
                    value = fieldValue
                        .map((v) => {
                            return  v.title || v.value
                        })
                        .join(',');
                }
                else if (typeof fieldValue === 'object') {
                    value =  fieldValue.title || fieldValue.value;
                }

                const id = product.productMetaFieldsMap && product.productMetaFieldsMap[key] ? product?.productMetaFieldsMap[key].id : null;

                payload.metafields.push({
                    id: id,
                    key: key,
                    value: value
                });

            }

        });

        payload.metafields.forEach((field) => {
            if (!field.id) {
                delete field.id;
            }
        });

        payload.variants = [];

        product.variantsOfCurrentSelection.forEach((item) => {

            const variant = {
                option1: item.option1,
                option2: item.option2,
                inventory_quantity: product.isOutOfStockMode? '0': parseInt(item.quantity) + '',
                price: '0',
                compare_at_price: '0'
            };

            if (product.variantMode === ProductVariantModeConst.NO_COLOR_MULTI_SIZE) {
                variant.option1 = item.option2;
                delete variant.option2;
            }
            else if (product.variantMode === ProductVariantModeConst.NO_COLOR_NO_SIZE) {
                delete variant.option2;
            }

            if (product.priceMode.value === ProductPriceConst.FULL_PRICE) {
                variant.price = parseInt(item.price) + '';
                variant.compare_at_price = '0';
            }
            else if (product.priceMode.value === ProductPriceConst.SALE) {
                variant.price = parseInt(item.price_sale) + '';
                variant.compare_at_price = parseInt(item.price) + '';
            }

            payload.variants.push(variant);

        });

        payload.options = [];
        if (product.variantMode === ProductVariantModeConst.NO_COLOR_NO_SIZE) {
            payload.options = [
                {
                    name: "title",
                    values: [
                        "title"
                    ]
                }
            ];
        }
        else if (product.variantMode === ProductVariantModeConst.MULTI_COLOR_MULTI_SIZE) {
            payload.options = [
                {
                    name: "color",
                    values: payload.variants.map((item) => item.option1)
                },
                {
                    name: "size",
                    values: payload.variants.map((item) => item.option2)
                }
            ];
        }
        else if (product.variantMode === ProductVariantModeConst.MULTI_COLOR_NO_SIZE) {
            payload.options = [
                {
                    name: "color",
                    values: payload.variants.map((item) => item.option1)
                }
            ];
        }
        else if (product.variantMode === ProductVariantModeConst.NO_COLOR_MULTI_SIZE) {
            payload.options = [
                {
                    name: "size",
                    values: payload.variants.map((item) => item.option2)
                }
            ];
        }

        console.log("====post product payload===", JSON.stringify(payload))

        return payload;
    }

}
