// import {
//     AUTH0_CLIENT_ID,
//     AUTH0_DOMAIN,
//     ALGOLIA_APP_ID,
//     ALGOLIA_API_KEY,
//     SENTRY_DSN,
//     ONESIGNAL_APP_ID,
//     STRIPE_PUBLISHABLE_KEY,
//     STRIPE_TESTING_KEY,
//     STRIPE_MERCHANT_ID,
//     SMARTLOOK_API_KEY,
//     IPINFO_TOKEN,
//     FB_CLIENT_ACCESS_TOKEN,
//     FB_APP_ID
// } from '@env';


const Keys = {};

Keys.Auth0 = {
    clientId: 'AUTH0_CLIENT_ID',
    domain: 'AUTH0_DOMAIN',
};

Keys.Algolia = {
    appId: 'ALGOLIA_APP_ID',
    apiKey: 'ALGOLIA_API_KEY'
};

Keys.Sentry = {
    dsn: 'SENTRY_DSN',
}

Keys.OneSignal = {
    appId: 'ONESIGNAL_APP_ID',
}


Keys.Stripe = {
    publishableKey: 'STRIPE_PUBLISHABLE_KEY',
    testingKey: '',
    merchantId: 'STRIPE_MERCHANT_ID'
}


Keys.Smartlook = {
    apiKey: ''
}

Keys.IpInfo = {
    token: ''
}

Keys.FB = {
    clientAccessToken: '',
    appID: ''
}


Object.freeze(Keys);
export default Keys;
