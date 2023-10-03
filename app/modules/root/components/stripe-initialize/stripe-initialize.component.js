import React, {useEffect} from 'react';
import Keys from "environments/keys";
import {initStripe} from "@stripe/stripe-react-native";
import {useSelector} from "react-redux";
import {appSelectors} from "modules/main/stores/app/app.store";

const StripeInitialize = () => {

    const appInitialized = useSelector(appSelectors.appInitializedSelector);
    const isStagingApi = useSelector(appSelectors.isStagingAPISelector);

    useEffect(() => {

        if (appInitialized) {
            initStripe({
                publishableKey: isStagingApi? Keys.Stripe.testingKey: Keys.Stripe.publishableKey,
                merchantIdentifier: Keys.Stripe.merchantId,
            }).catch(console.warn);
        }

    }, [appInitialized, isStagingApi])

    return <></>
}

export default StripeInitialize
