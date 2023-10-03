import React from 'react';

import ProductAdd from "modules/product/components/product-add/product-add.component";
import WillShowToast from "deelzat/toast/will-show-toast";

const ProductAddContainer = (props) => {

    const {
        trackSource,
    } = props.route?.params || {};

    return (
        <>
            <WillShowToast id={'product-add'}/>
            <ProductAdd trackSource={trackSource} />
        </>
    );
};

export default ProductAddContainer;
