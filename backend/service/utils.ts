export class Utils {
   static path(rawPath: string) {
        return rawPath.split('/').filter((_: string) => _.length);
    }
    static vkAPIHost() {
       return 'https://api.vk.com'
    }
    static vkAPIVersion() {
        return '5.131'
    }
}