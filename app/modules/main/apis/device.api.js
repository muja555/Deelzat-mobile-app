import Http from "deelzat/http";
import DeviceUpdateInput from "modules/main/inputs/device-update.input";

const DeviceApi = {};

DeviceApi.update = async (inputs: DeviceUpdateInput) => {
    return Http.post('/app/devices', inputs.payload())
};

export default DeviceApi;
