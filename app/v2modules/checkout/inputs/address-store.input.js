//@flow
import HrcInput from "deelzat/types/Input";
import AddressFieldNames from 'v2modules/checkout/constants/address-field-names.const';
import { getFullNumber } from 'modules/main/others/phone.utils';
export default class AddressStoreInput extends HrcInput{

    addressFields;

    // route
    addressId: string;

    constructor() {
        super();
    }

    payload() {

        const getFullMobile = (fields) => getFullNumber(fields[AddressFieldNames.MOBILE_COUNTY_CODE], fields[AddressFieldNames.MOBILE_LOCAL_NUMBER]);

        const payload = {};

        payload.title = this.addressFields[AddressFieldNames.TITLE];
        payload.first_name = this.addressFields[AddressFieldNames.FIRST_NAME];
        payload.last_name = this.addressFields[AddressFieldNames.LAST_NAME];
        payload.phone = getFullMobile(this.addressFields);
        payload.street =  this.addressFields[AddressFieldNames.ADDRESS];
        payload.city_id = this.addressFields[AddressFieldNames.CITY]?.objectID;
        payload.country = this.addressFields[AddressFieldNames.COUNTRY]?.objectID;

        return payload;
    }

}
