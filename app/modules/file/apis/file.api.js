import Http from "deelzat/http";
import ImageUploadInput from "modules/file/inputs/image-upload.input";
import axios from 'axios';

const FileApi = {};

FileApi.imageSignedUrlGet = async () => {
    return Http.get('/app/images/signed-url?ContentType=image/jpeg')
};

FileApi.imageUpload = async (inputs: ImageUploadInput) => {
    return axios.put(
        inputs.signedUrl,
        inputs.getBuffer(),
        {
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Encoding': 'base64',
            },
        }
    )
};

export default FileApi;
