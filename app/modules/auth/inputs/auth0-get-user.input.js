//@flow
import HrcInput from "deelzat/types/Input";
import jwt_decode from "jwt-decode";

export default class Auth0GetUserInput extends HrcInput{

    //route
    accessToken: string;

    //payload
    id: string;

    constructor(auth0Credentials) {

        super();
        this._payload = [
            'id',
        ];

        try {
            const decoded  = jwt_decode(auth0Credentials.idToken);
            this.accessToken = auth0Credentials.accessToken;
            this.id = decoded.sub;
        }
        catch (e) {

        }
    }
}
