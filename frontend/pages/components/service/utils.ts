import {NAVI} from "../constants/navigation";

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
}
