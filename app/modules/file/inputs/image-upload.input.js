//@flow
import {Buffer} from 'buffer';
import url from 'url';
import HrcInput from "deelzat/types/Input";

export default class ImageUploadInput extends HrcInput{

    // route
    signedUrl: number;

    //others
    base64: any;

    constructor() {
        super();
    }

    getBuffer(){
        return Buffer.from(
            this.base64.replace(/^data:image\/\w+;base64,/, ''),
            'base64',
        );
    }

    getImageUrl() {
        const urlObject = url.parse(this.signedUrl);
        return `${urlObject.protocol}//${urlObject.hostname}${urlObject.pathname}`;
    }



}
