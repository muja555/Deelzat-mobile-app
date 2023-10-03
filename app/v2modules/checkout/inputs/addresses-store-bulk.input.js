//@flow
import HrcInput from "deelzat/types/Input";
import AddressStoreInput from 'v2modules/checkout/inputs/address-store.input';
import AddressFieldNames from 'v2modules/checkout/constants/address-field-names.const';
export default class AddressesStoreBulkInput extends HrcInput{

    savedAddresses: [];

    constructor() {
        super();
    }


    payload() {
        const list = [];
        this.savedAddresses.forEach((address, index) => {
            const inputs = new AddressStoreInput();
            address[AddressFieldNames.TITLE] = `address_${(index + 1)}`
            inputs.addressFields = address;
            list.push(inputs.payload());
        });

        return {
            addresses: list
        }
    }
}
