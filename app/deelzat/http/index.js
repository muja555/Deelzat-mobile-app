import HaysRequest, {addToRequestHeader, HaysDelete, HaysGet, HaysPost, HaysPut, setEnvClient} from './request'

const HaysHttp = {};

HaysHttp.request = HaysRequest;
HaysHttp.post = HaysPost;
HaysHttp.get = HaysGet;
HaysHttp.put = HaysPut;
HaysHttp.delete = HaysDelete;

export default HaysHttp;

export { setEnvClient as setEnvClient }
export { addToRequestHeader as addToRequestHeader }
