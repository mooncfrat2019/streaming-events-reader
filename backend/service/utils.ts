export class Utils {
   static path(rawPath: string) {
        return rawPath.split('/').filter((_: string) => _.length);
    }
}