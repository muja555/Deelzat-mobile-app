
const calculateProductOverallPricesAndQuantity = (product) => {
    if (!product)
        return product;

    const originalPrice = product.price;
    const originalCompareAtPrice = product.compare_at_price;

    product.compare_at_price = Number.MIN_SAFE_INTEGER;
    product.price = Number.MIN_SAFE_INTEGER;
    product.inventory_quantity = 0;
    product.variants?.forEach((v) => {

        product.inventory_quantity = parseInt(product.inventory_quantity) + parseInt(v.inventory_quantity);

        if (product.compare_at_price < v.compare_at_price) {
            product.compare_at_price = v.compare_at_price
        }
        if (product.price < v.price) {
            product.price = v.price
        }
        });

    product.price = product.price > 0? product.price : originalPrice
    product.compare_at_price = product.compare_at_price > 0? product.compare_at_price : originalCompareAtPrice

    return product;
}

export {calculateProductOverallPricesAndQuantity as calculateProductOverallPricesAndQuantity}


const calculateProductsOverallPricesAndQuantity = (productList) => {

    return productList?.map((item) => {
        return calculateProductOverallPricesAndQuantity(item)
    });
}

export {calculateProductsOverallPricesAndQuantity as calculateProductsOverallPricesAndQuantity}


const attachQueryIDForProducts = (productList, queryID) => {

    if (!queryID) {
        return productList;
    }

    return productList?.map((item) => {
        item.queryID = queryID;
        return item;
    });
}
export {attachQueryIDForProducts as attachQueryIDForProducts}


const prepareProductHits = (hits, queryID) => {

    const pushProduct = (products, product) => {
        if (products[product.id]) {
            products[product.id] = pushOptions(products[product.id], product.options);
            products[product.id] = pushImages(products[product.id], product.image);
            products[product.id].variants.push(generateVariants(product));
            if (products[product.id].price > product.price)
                products[product.id].price = product.price;
        }
        else {
            product = pushOptions(product, product.options);
            product = pushImages(product, product.image);
            product.variants = [generateVariants(product)];
            products[product.id] = product;
        }
        return products;
    }

    const generateVariants = (product) => {
        return {
            option1: product.option1,
            option2: product.option2,
            price: product.price,
            compare_at_price: product.compare_at_price,
            image_id: 0,
            inventory_quantity: product.inventory_quantity
        };
    }

    const pushOptions = (product, options) => {
        if (product.options && Array.isArray(product.options)) {
            Object.entries(options).map(([name, value]) => {
                const index = product.options.findIndex(option => option.name === name);
                if (index === -1) {
                    product.options.push({
                        name: name,
                        values: [value]
                    });
                }
                else {
                    product.options[index].values.push(value);
                }
            });
        }
        else if (options){
            product.options = Object.entries(options).map(([name, value]) => ({
                name: name,
                values: [value]
            }));
        }
        return product;
    }

    const pushImages = (product, image) => {
        if (product.images && !product.images.includes(image)) {
            product.images.push(image);
        }
        else {
            product.images = image ? [image] : [];
        }
        return product;
    }

    let list = hits.map(hit => {
        if (queryID) {
            hit.queryID = queryID;
        }
        return hit;
    })

    list = list.reduce((products, product) => pushProduct(products, product), {});
    list = Object.values(list);
    list = calculateProductsOverallPricesAndQuantity(list);
    return list;
}
export {prepareProductHits as prepareProductHits}


const isDiscountProduct = (product) => {
    return product.compare_at_price > product.price && (!!product.variants_inventory_count && parseInt(product.variants_inventory_count) > 0);
}
export {isDiscountProduct as isDiscountProduct}


const isSoldOutProduct = (product) => {
    return !!product.variants_inventory_count && parseInt(product.variants_inventory_count) === 0;
}
export {isSoldOutProduct as isSoldOutProduct}


