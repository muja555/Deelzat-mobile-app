import React, {useEffect} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {authSelectors} from "modules/auth/stores/auth/auth.store";
import {boardThunks} from "v2modules/board/stores/board.store";
import {cartThunks} from "modules/cart/stores/cart/cart.store";
import {addressesThunks} from "v2modules/checkout/stores/addresses/addresses.store";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";

/**
 * To sync saved and cart products, each user has own saved and cart
 */
const SyncUserSavedItems = () => {

    const dispatch = useDispatch();
    const auth0User = useSelector(authSelectors.auth0UserSelector);
    const isAuthChecked = useSelector(authSelectors.checkedSelector);
    const browseCountryCode = useSelector(geoSelectors.geoBrowseCountryCodeSelector);

    useEffect(() => {

        if (isAuthChecked && browseCountryCode) {

            dispatch(boardThunks.loadWishlist(auth0User?.userId, browseCountryCode));
            dispatch(cartThunks.loadCart(auth0User?.userId, browseCountryCode));
            dispatch(addressesThunks.refreshUserAddresses(true));
        }

    }, [auth0User?.userId, browseCountryCode, isAuthChecked]);


    return (
        <></>
    );
};

export default SyncUserSavedItems;
