
import TeamUsers from '../page/TeamUsersManage';
import TeamManage from '../page/TeamManage';
import FeishuLogin from '../page/FeishuLogin';
import layout from '../layout';

export const FILE_MANAGE_PATH_WITHOUT_PARAMS = '/file-manege/';

export const WORKBENCH_PATH = '/workbench';

const RouterList: Array<any> = [
    {
        name: '团队管理',
        path: '/',
        component: TeamManage,
        layout: layout,
        hiddenMenu: false,
    },
    {
        name: '团队管理',
        path: '/team-manage',
        component: TeamManage,
        layout: layout,
        hiddenMenu: true,

    },
    {
        name: '用户管理',
        path: '/team-users',
        component: TeamUsers,
        layout: layout,
        hiddenMenu: false,
    },
    {
        name: '飞书登录',
        path: 'feishu/callback',
        component: FeishuLogin,
        layout: layout,
        hiddenMenu: false,
    },
];

export default RouterList;
