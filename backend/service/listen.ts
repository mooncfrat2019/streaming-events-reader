import {App} from "./app";
import {config} from "./config";

export const listen = () => {
    const START_PORT = config.PORT;
    const ports = Array(Number(config.INSTANCES) || 1).fill(null).map((_, index) => Number(START_PORT) + index);
    console.log('ports', ports);
    ports.map((port) => {
        console.log(`Listen on port: ${port}`)
        return App.listen(port);
    });
}
