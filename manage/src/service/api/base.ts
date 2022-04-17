export type JsonResponse<Data = any> = {
    code: number;
    msg: string;
    data: Data;
};

/**
 * @class Client http接口的默认client
 */
export class Client {
    private _host: string;
    private _prefix: string;

    constructor(host, prefix) {
        this._host = host;
        this._prefix = prefix === '' ? '/' : prefix;
    }

    /**
     * 根据uri自动拼接url地址
     * @param uri
     * @returns
     */
    url(uri: string): string {
        uri = uri[0] === '/' ? uri : '/' + uri;
        return this._host + this._prefix + uri;
    }
}
