
import TeamUsers from '../page/TeamUsersManage';
import TeamManage from '../page/TeamManage';

export const FILE_MANAGE_PATH_WITHOUT_PARAMS = '/file-manege/';

export const WORKBENCH_PATH = '/workbench';

const RouterList: Array<any> = [
    {
        name: 'team-manage',
        path: '/',
        component: TeamManage,
    },
    {
        name: 'team-manage',
        path: '/team-manage',
        component: TeamManage,
    },
    {
        name: 'team-users',
        path: '/team-users',
        component: TeamUsers,
    },
];

export default RouterList;
