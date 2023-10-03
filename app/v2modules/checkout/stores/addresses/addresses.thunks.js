import AddressesApi from 'v2modules/checkout/apis/addresses.api';
import * as Actions from "./addresses.actions";
import { getShippingAddressesList, saveShippingAddressesList } from 'v2modules/checkout/others/addresses.localstore';
import AddressesStoreBulkInput from 'v2modules/checkout/inputs/addresses-store-bulk.input';

export const refreshUserAddresses = (checkLegacySavedAddresses) => {
    return async (dispatch, getState) => {

        let result = [];

        const isAuthenticated = getState().auth.isAuthenticated;
        if (isAuthenticated) {

            if (checkLegacySavedAddresses) {
                try {

                    const legacyItems = await getShippingAddressesList() || [];
                    if (legacyItems?.length > 0) {
                        const inputs = new AddressesStoreBulkInput();
                        inputs.savedAddresses = legacyItems;
                        await AddressesApi.createBulk(inputs);
                        saveShippingAddressesList([]);
                    }

                } catch (e) {
                    console.warn(e);
                }
            }


            try {
                result = await AddressesApi.getList();
            } catch (e) {
                console.warn(e);
            }
        }

        dispatch(Actions.SetUserAddresses(result));

        return Promise.resolve();
    }
};
