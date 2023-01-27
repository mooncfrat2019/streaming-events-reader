import {logger} from "./service/logger";
import {listen} from "./service/listen";
import {context} from "./service/context";
import {router} from "./service/router";


logger();

context();

router();

listen();