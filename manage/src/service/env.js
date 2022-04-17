/**
 * 域名映射登录地址和 websocket 调度地址
 * @type {[key: window.location.hostname]: window.location.origin}
 * TODO:登陆单独拿出来：为了方便后期支持单独的登录服务
 */
const baseURLMap = {
    dev: {
        note: '',
        message: 'ws://note.dev.kxsz.net/api/msg/ws',
        passport: '',
        storage: '',
    },
    test: {
        note: '',
        message: 'ws://note.test.kxsz.net/api/msg/ws',
        passport: '',
        storage: '',
    },
    prod: {
        note: '',
        message: 'wss://note.kxsz.net/api/msg/ws',
        passport: '',
        storage: '',
    },
};

const helpCenterLink = {
    dev: {
        service: 'http://note.dev.kxsz.net/share/1e1d56cd-cd3f-4607-812d-d39270e89d9a',
        privacyPolicy: 'http://note.dev.kxsz.net/share/6bc85099-9a9c-489b-b0fa-83ff25f785fb',
    },
    test: {
        service: 'http://note.test.kxsz.net/share/4fc9e1b5-72ce-4715-8acb-8330aad1d6aa',
        privacyPolicy: 'http://note.test.kxsz.net/w/8980d25d-b0fa-45d8-868d-1af0255eccfd',
    },
    prod: {
        service: 'https://note.kxsz.net/share/04fc7956-77b4-46b8-9224-8e9ea74d6b00',
        privacyPolicy: 'https://note.kxsz.net/share/04bc1c03-6206-44ea-ba42-63636d71d977',
    },
};

const getHelpCenterLink = () => {
    switch (import.meta.env.MODE) {
        // 开发环境
        case 'development':
        case 'dev':
        case 'develop':
            return helpCenterLink.dev;
        // 测试环境
        case 'test':
            return helpCenterLink.test;
        // 生产环境
        case 'prod':
        case 'master':
        case 'production':
            return helpCenterLink.prod;
        default:
            return helpCenterLink.prod;
    }
};

const baseURLByEnv = () => {
    switch (import.meta.env.MODE) {
        // 开发环境
        case 'development':
        case 'dev':
        case 'develop':
            return baseURLMap.dev;
        // 测试环境
        case 'test':
            return baseURLMap.test;
        // 生产环境
        case 'prod':
        case 'master':
        case 'production':
            return baseURLMap.prod;
        default:
            return baseURLMap.prod;
    }
};

// api 请求地址
export const baseURL = baseURLByEnv();

export const centerLink = getHelpCenterLink();
