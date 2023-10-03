import Keys from "environments/keys";
import EndPoints from "environments/end-points";
const GeoLocationApi = {};

GeoLocationApi.getGeoLocation = () => {

    return fetch(`${EndPoints.IPINFO}?token=${Keys.IpInfo.token}`)
        .then((response) => response.json())
};

export default GeoLocationApi;
