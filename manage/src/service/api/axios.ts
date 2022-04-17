import axios from 'axios';
import qs from 'qs';
import { Message } from '@arco-design/web-react';

const http = axios.create({
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    },
});

let token = '';
const getToken = () => {
    try {
        token = localStorage.getItem('token') || '';
        return token || '';
    } catch (e) {
        return '';
    }
};
/* 请求拦截器 */
http.interceptors.request.use(
    (config: any) => {
        const authToken = getToken();
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (resp: any) => {
        // http 状态码处理，如果不是200则都是服务器异常
        switch (resp.status) {
            case 200: {
                if (resp.data) {
                    // 处理特殊的状态码
                    switch (resp.data.code) {
                        case 0: {
                            return resp.data;
                        }
                        case 401: {
                            console.log('需要登录');
                            break;
                        }
                        default: {
                            return resp.data;
                        }
                    }
                    return resp.data;
                } else {
                    // Message.error({ content: '服务器异常，请重试' });
                    // return Promise.reject(new Error('服务器异常，请重试'));
                    return resp;
                }
            }
            default: {
                Message.error({
                    content: '请求失败：服务器异常（' + resp.status + '）',
                });
                break;
            }
        }
    },
    (error) => {
        Message.error({ content: '请求失败：' + error.message });
        if (import.meta.env.DEV) {
            console.log(error);
        }
        // return Promise.reject(error);
    }
);

export default http;
