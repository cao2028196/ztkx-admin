import http from './axios';
import { Client, JsonResponse } from './base';


/**
 * Note api
 * 文档地址
 * http://192.168.2.2:8002/swagger/index.html
 */
export class Note extends Client {
    /**
     * 后台登录
     * @returns
     */
     accountLogin = async (params): Promise<JsonResponse> => {
        return await http.post(this.url('account/login'), JSON.stringify(params));
    };
    /**
     * 获取团队列表
     * @returns
     */
     teamList = async (params): Promise<JsonResponse> => {
        return await http.post(this.url('teamList'), JSON.stringify(params));
    };
    /**
     * 创建团队
     * @returns
     */
    teamCreate = async (params): Promise<JsonResponse> => {
        return await http.post(this.url('teamCreate'), JSON.stringify(params));
    };
    /**
     * 获取团队用户
     * @returns
     */
    teamMemberList = async (params): Promise<JsonResponse> => {
        return await http.post(this.url('teamMemberList'), JSON.stringify(params));
    };
    /**
     * 移交团队
     * @returns
     */
    teamTransfer = async (params): Promise<JsonResponse> => {
        return await http.post(this.url('teamTransfer'), JSON.stringify(params));
    };
    /**
     * 编辑团队
     * @returns
     */
    teamModify = async (params): Promise<JsonResponse> => {
        return await http.post(this.url('teamModify'), JSON.stringify(params));
    };
    /**
     * 查询所有用户
     * @returns
     */
    userSearch = async (params): Promise<JsonResponse> => {
        return await http.post(this.url('user/search'), JSON.stringify(params));
    };
    /**
     * 团队添加成员
     * @returns
     */
     teamMemberAdd = async (params): Promise<JsonResponse> => {
        return await http.post(this.url('teamMemberAdd'), JSON.stringify(params));
    };
    /**
     * 团队批量添加成员
     * @returns
     */
     teamMemberMulti = async (params): Promise<JsonResponse> => {
        return await http.post(this.url('teamMemberMulti'), params);
    };
    /**
     * 修改团队成员
     * @returns
     */
     teamMemberModify = async (params): Promise<JsonResponse> => {
        return await http.post(this.url('teamMemberModify'), JSON.stringify(params));
    };
    /**
     * 移除团队成员
     * @returns
     */
    //  teamMemberModify = async (params): Promise<JsonResponse> => {
    //     return await http.post(this.url('teamMemberModify'), JSON.stringify(params));
    // };
}
