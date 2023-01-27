import axios from "axios";
import {Utils} from "./utils";

export const auth = async (service_token: String) => {
    const { vkAPIHost, vkAPIVersion } = Utils;
    const data = await axios.get(`${vkAPIHost}/method/streaming.getServerUrl?access_token=${service_token}&v=${vkAPIVersion}`);
    console.log('data', data);
    return data;
}

export const getRules = async (endpoint: String, key: String ): Promise<any> => {
    return await axios.get(`https://${endpoint}/rules?key=${key}`);
}
