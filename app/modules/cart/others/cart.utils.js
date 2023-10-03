import I19n from "dz-I19n";

const addProductsToCartItems = (cartItems = [], productsList = []) => {

    cartItems.forEach(item => {
        const product = productsList.find(_product => _product.id == item.productID)
        if (product) {
            let variant;
            if (item.variantID) {
                variant = product?.variants?.find(_variant => _variant.id == item.variantID);
            }

            item.product = product;
            item.variant = variant;
            if (item.variantID && !variant) {
                item.isMissingVariant = true;
            }

            if (variant && !variant.inventory_quantity) {
                item.product.isNotFound = true;
            }
            else if (!variant && !item.product.variants?.find(_v => _v.inventory_quantity > 0)) {
                item.product.isNotFound = true;
            }
        }
        else if (!item.product) {
            item.product = {
                title: item.product?.title,
                image: item.product?.image,
                isNotFound: true
            }
        } else {
            item.product = {...item.product, isSkeleton: false, isNotFound: item.product.price === undefined}
        }
    })

    return cartItems;
}
export {addProductsToCartItems as addProductsToCartItems}


const getTotalCartItemsPrice = (cartItems = []) => {
    let totalPrices = 0;
    cartItems
        .filter(isCheckableItem)
        .forEach(item => {
            let _price = item.variant? item.variant.price : item.product.price;
            _price = _price * item.quantity;
            totalPrices = totalPrices + _price;
    })

    return totalPrices
}
export {getTotalCartItemsPrice as getTotalCartItemsPrice}


const getVariantLabel = (variant) => {
    const tempArr = [];
    if (variant?.option1 && variant?.option1 !== 'title') {
        tempArr.push(`${I19n.t('لون')}: ${variant.option1}`);
    }

    if (variant?.option2) {
        tempArr.push(`${I19n.t('حجم')}: ${variant.option2}`);
    }
    return tempArr.length? tempArr.join(',  '): undefined;
}

export {getVariantLabel as getVariantLabel}


const checkForMissingVariants = (cartItems = []) => {
    let isMissingVariantExists = false;
    cartItems.forEach(item => {
        if (!!item.variantID && !item.variant)
            isMissingVariantExists = true;

    })

    return isMissingVariantExists;
}
export {checkForMissingVariants as checkForMissingVariants}


const isCheckableItem = (cartItem = {}) => {

    return !!cartItem.product &&
        !cartItem.product.isSkeleton &&
        !cartItem.product.isNotFound &&
        !cartItem.isMissingVariant
}
export {isCheckableItem as isCheckableItem}
