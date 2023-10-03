//@flow
import HrcInput from "deelzat/types/Input";

export default class ShopEditInput extends HrcInput {

    countryCode: string;
    fields: string;
    shopData;
    themeId: string;

    constructor() {
        super();
    }

    payload() {

        let payload = {};

        payload.user = {};
        payload.user.firstName = this.shopData? this.shopData.user?.firstName :  this.fields.firstName;
        payload.user.lastName = this.shopData?  this.shopData.user?.lastName : this.fields.lastName;
        payload.user.email = this.shopData? this.shopData.user?.email: this.fields.email;
        payload.user.mobileNumber = this.shopData? this.shopData.user?.mobileNumber : this.fields.mobileNumber;
        payload.user.picture = this.fields?.picture? this.fields.picture: this.shopData?.user?.picture;

        payload.name = this.shopData? this.shopData.name : this.fields.storeName;
        payload.username = this.shopData? this.shopData.username: this.fields.username;

        payload.address = {};
        payload.address.city = this.shopData? this.shopData.address?.city : this.fields.city;
        payload.address.country = this.shopData? this.shopData.address?.country : this.fields.country;
        payload.address.street = this.shopData? this.shopData.address?.street : this.fields.street;

        payload.extra_data = {};
        payload.extra_data.payment_method = '';
        payload.extra_data.payment_method_information = '';
        payload.extra_data.whatsapp_number = this.shopData? this.shopData?.extra_data.whatsapp_number: this.fields.whatsappNumber;
        payload.extra_data.description = this.fields?.description || payload.extra_data.description;
        payload.country_codes = [this.countryCode];
        payload.theme_id = this.themeId;

        return payload;
    }

}
