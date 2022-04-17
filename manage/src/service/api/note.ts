import http from './axios';
import { Client, JsonResponse } from './base';

import { NoteAuthorizeParams } from '../typing';

/**
 * Note api
 * 文档地址
 * http://192.168.2.2:8002/swagger/index.html
 */
export class Note extends Client {
    /**
     * 获取空间列表
     * @returns
     */
    getUserSpaces = async (): Promise<JsonResponse> => {
        return await http.get(this.url('team/list'));
    };

}
