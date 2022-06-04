// @ts-ignore
import vkflow from 'vkflow';
import {config} from "../service/config";
import {DATA} from "../service/db";

try {
    const stream = vkflow(
        config.SERVICE_KEY,
        []
    );

    DATA.sync();

    stream.on('data', (event: any) => {
        DATA.create({ event })
            .then((result) => console.log(result))
            .catch((e) => console.log(e));
    });

    stream.on('error', console.error);

} catch (e) {
    console.error(e)
}
