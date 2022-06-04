import {NAVI} from "../constants/navigation";
import {config} from "./config";

export class Utils {

    public view(id: string): string {
        return Object.getOwnPropertyNames(NAVI).filter((i) => i === id).join('') || 'unknown';
    }

    public panel(view: string, id: string): string {
        if (NAVI[view]) {
            return Object.getOwnPropertyNames(NAVI[view]).filter((i) => i === id).join('')
        } else {
            return 'unknown';
        }
    }

    host(): string {
        console.log(process.env)
        if (config.BACKEND_HOST === 'localhost') {
            return `http://localhost`
        }
        return `https://${config.BACKEND_HOST}`
    }
}
