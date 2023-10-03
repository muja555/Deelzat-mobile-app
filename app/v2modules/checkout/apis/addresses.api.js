import Http from "deelzat/http";
import AddressStoreInput from 'v2modules/checkout/inputs/address-store.input';
import AddressesStoreBulkInput from 'v2modules/checkout/inputs/addresses-store-bulk.input';

const AddressesApi = {};

AddressesApi.getList = async () => {
    return Http.get(`/app/users/addresses`);
};


AddressesApi.create = async (input: AddressStoreInput) => {
    return Http.post('/app/users/addresses', input.payload())
}

AddressesApi.createBulk = async (input: AddressesStoreBulkInput) => {
    return Http.post('/app/users/addresses/bulk', input.payload())
}

AddressesApi.update = async (input: AddressStoreInput) => {
    return Http.put(`/app/users/addresses/${input.addressId}`, input.payload())
}

AddressesApi.update = async (input: AddressStoreInput) => {
    return Http.put(`/app/users/addresses/${input.addressId}`, input.payload())
}

AddressesApi.delete = async (input: AddressStoreInput) => {
    return Http.delete(`/app/users/addresses/${input.addressId}`)
}



export default AddressesApi;
