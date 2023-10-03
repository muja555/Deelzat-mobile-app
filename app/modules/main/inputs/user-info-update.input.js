//@flow
import HrcInput from "deelzat/types/Input";

export default class UserInfoUpdateInput extends HrcInput {

    metadata;
    firstName;
    lastName;

    constructor() {
        super();
    }

    payload() {

        const payload = {};
        if (this.metadata) {
            payload.metadata = this.metadata;
        }
        else {

            const metadata = {};
            if (this.firstName) {
                metadata.firstName = this.firstName;
            }
            if (this.lastName) {
                metadata.lastName = this.lastName;
            }

            payload.metadata = metadata;
        }

        return payload;
    }
}
