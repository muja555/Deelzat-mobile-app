//@flow
import HrcInput from "deelzat/types/Input";

export default class DeviceUpdateInput extends HrcInput{


    //payload
    device_id: string;
    token: string;
    locale: string;
    os: string;
    app_version: string;
    app_build: string;
    app_version_build: string;
    brand: string;
    os_version: string;
    logged_in: string;
    user_id: string;


    constructor() {
        super();
    }

    payload() {
        const payload = {
            device_id: this.device_id,
            token: this.token,
            os: this.os,
            locale: this.locale,
            app_version: this.app_version,
            app_build: this.app_build,
            app_version_build: this.app_version_build,
            brand: this.brand,
            os_version: this.os_version,
            logged_in: this.logged_in,
            user_id: this.user_id,
            token_valid: !!this.token,
        };
        return payload;

    }

}
