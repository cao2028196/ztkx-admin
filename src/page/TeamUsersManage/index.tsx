import { useState, useEffect } from 'react';
import {
    Input,
    Select,
    Button,
    Popconfirm,
    Table,
    Modal,
    Message,
    Spin,
    InputNumber,
} from '@arco-design/web-react';
import { useLocation } from 'react-router-dom';
import { TeamAvatar } from '../../components/Avatar';
import noteService from '../../service/note';
import AddTeamUser from '../components/AddTeamUser';
import AddTeamUsers from '../components/AddTeamUsers';
import ChangeOwner from '../components/ChangeOwner';
import './index.less';
// import styles from './styles.module.less';
// import { useCurrentTeam } from '@/hooks/useCurrentTeam';
// import { useUserContextValue } from '@/layout/WorkspaceLayout/contexts';
const Option = Select.Option;
const roles = [{"key":200,"value":"管理员"},{"key":300,"value":"普通成员"}]

type editorAction = {
    identity_name?: string;
    inviter?: string;
    nick?: string;
    phone?: string;
    profile?: string;
    school_name?: string;
    specialty_name?: string;
    user_id?: string;
};
const SpaceUsers = () => {
    const {search, state} = useLocation()as any
    const team_id = search.split(':')[1]
    const team: any = {team_id}
    const [data, setData] = useState([]);
    const [phone, setPhone] = useState('');
    const [nick, setNick] = useState('');
    const [role, setRole] = useState();
      
    // const [roles, setRoles] = useState([]);
    const [teamUserVisible, setTeamUserVisible] = useState(false);
    const [changeOwnerVisible, setChangeOwnerVisible] = useState(false);
    const [teamUsersVisible, setTeamUsersVisible] = useState(false);
    const [editorVisible, setEditorVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [editorRole, setEditorRole] = useState();
    const [editorAction, setEditorAction] = useState<editorAction>({ user_id: '' });
    const [pagination, setPagination] = useState({
        total: 0,
        pageSize: 10,
        current: 1,
    });

    useEffect(() => {
        if (team_id) getTeamUserList();
    }, [team_id, page]);

    useEffect(() => {
        setPage(1);
    }, [phone, nick, role,]);

    // const getTeamRoles = async () => {
    //     const res = await noteService.getTeamRoles();
    //     if (res.code === 0) {
    //         setRoles(res.data.list);
    //     }
    // };

    const getTeamUserList = async () => {
        const res = await noteService.teamMemberList({
            n: 10,
            p: page,
            team_id: team_id,
            phone,
            nick,
            role,
        });
        if (res.code === 0 && res?.data?.list) {
            const arr = res.data.list.map((d: any) => {
                return {
                    ...d,
                    school_name: d.profile?.school_name,
                    specialty_name: d.profile?.specialty_name,
                    identity_name: d.profile?.position_name,
                };
            });
            setData(arr);
            setPagination((pagination) => ({
                ...pagination,
                total: res.data.count,
                current: res.data.p,
            }));
        }
        return res;
    };

    const onChangeTable = async (pagination: any) => {
        const { current, pageSize } = pagination;
        setPage(current);
    };

    const onSubmit = () => {
        getTeamUserList();
    };

    const columns = [
        {
            title: '手机号',
            dataIndex: 'phone',
        },
        {
            title: '用户名',
            dataIndex: 'nick',
        },
        {
            title: '邀请人',
            dataIndex: 'inviter',
        },
        // {
        //     title: '身份',
        //     dataIndex: 'identity_name',
        // },
        // {
        //     title: '学校',
        //     dataIndex: 'school_name',
        // },
        // {
        //     title: '专业',
        //     dataIndex: 'specialty_name',
        //     width: 300,
        //     render: (col, record) => {
        //         const text = record?.specialty_name?.join(', ');
        //         return (
        //             <Tooltip position="top" trigger="hover" content={text}>
        //                 <div
        //                     style={{
        //                         textOverflow: 'ellipsis',
        //                         whiteSpace: 'nowrap',
        //                         overflow: 'hidden',
        //                         width: '350px',
        //                     }}
        //                 >
        //                     {text}
        //                 </div>
        //             </Tooltip>
        //         );
        //     },
        // },
        {
            title: '权限',
            dataIndex: 'role_name',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'op',
            render: (col: any, record: any) => (
                <div className="option-btn">
                    <span className="option-btn-normal" onClick={() => editorUser(record)}>
                        编辑
                    </span>
                    <Popconfirm title="确定要从团队删除此成员?" onOk={() => removeRow(record)}>
                        <span className="option-btn-delete">移除</span>
                    </Popconfirm>
                </div>
            ),
        },
    ];
    const editorUser = (record: any) => {
        if (record.role === 100) {
            Message.info('不可编辑');
            return;
        }
        setEditorVisible(true);
        setEditorRole(record.role);
        setEditorAction(record);
    };
    const removeRow = async (record) => {
        if (record.role === 100) {
            Message.info('不可移除');
            return;
        }

        const res = await noteService.teamBlocks({
            team_id,
            owner: record.user_id
        })
        if (res.code === 0) {
            if (res.data.blocks) {
                // 如果有笔记，选择管理员继承笔记
                setEditorAction(record);
                setChangeOwnerVisible(true)
            }else {
                const resp = await noteService.teamMemberRemove({
                    team_id,
                    owner: record.user_id,
                });
                getTeamUserList();
                Message.info(resp.msg);
            }
        }

        
    };

    const submitEditor = async () => {
        const res = await noteService.teamMemberModify({
            uid: editorAction.user_id,
            team_id: team.team_id,
            role: editorRole,
        });

        if (res.code === 0) {
            setEditorVisible(false);
            getTeamUserList();
            Message.success(res.msg);
        } else {
            Message.info(res.msg);
        }
    };
    return (
        <div className="space-user">
            <Spin loading={team === null} style={{ width: '100%' }}>
                <div className="space-page-title">成员管理</div>
                <div className="space-name">
                    <div className="space-name-pic">
                            <TeamAvatar
                                size={36}
                                src={state?.icon}
                                alt={state?.icon_name}
                                id={state?.team_id}
                                className="team-avatar"
                            />
                    </div>
                    <div>{state?.name}</div>
                </div>

                <div className="space-block-title">成员列表</div>
                <div>
                    <div className="space-user-form">
                        <div className="space-user-form-add">
                            <Button type="primary" onClick={() => setTeamUserVisible(true)}>
                                <i className="keenote icon-keenote-block-plus" />
                                添加新成员
                            </Button>
                            <Button type="outline" onClick={() => setTeamUsersVisible(true)}>
                                批量添加
                            </Button>
                        </div>
                        <div className="space-user-form-list">
                            <div>
                                <span>手机号</span>
                                <span>
                                    <InputNumber
                                        style={{ width: 240, height: 32 }}
                                        placeholder="请输入手机号"
                                        value={phone}
                                        onChange={(val) => setPhone(val ? val.toString() : '')}
                                    />
                                </span>
                            </div>
                            <div>
                                <span>用户名</span>
                                <span>
                                    <Input
                                        allowClear
                                        style={{ width: 120, height: 32 }}
                                        placeholder="请输入昵称"
                                        value={nick}
                                        onChange={(val) => setNick(val)}
                                    />
                                </span>
                            </div>
                            <div>
                                <span>权限</span>
                                <span>
                                    <Select
                                        allowClear
                                        placeholder="请选择权限"
                                        style={{ width: 120, height: 32 }}
                                        value={role}
                                        onChange={(val) => setRole(val)}
                                    >
                                        {roles.map((d) => (
                                            <Option key={d.key} value={d.key}>
                                                {d.value}
                                            </Option>
                                        ))}
                                    </Select>
                                </span>
                            </div>
                            <div className="creat-space-footer-button">
                                <Button type="primary" htmlType="submit" onClick={onSubmit}>
                                    搜索
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="space-user-list">
                        <Table
                            data={data}
                            columns={columns}
                            rowKey={'user_id'}
                            className="table-demo-editable-cell"
                            pagination={pagination}
                            onChange={onChangeTable}
                        />
                    </div>
                </div>
                {teamUserVisible && <AddTeamUser
                    team={team}
                    visible={teamUserVisible}
                    setVisible={setTeamUserVisible}
                    getTeamUserList={getTeamUserList}
                    roleList={roles}
                />}
                {teamUsersVisible && <AddTeamUsers
                    team={team}
                    visible={teamUsersVisible}
                    setVisible={setTeamUsersVisible}
                    getTeamUserList={getTeamUserList}
                />}
                {changeOwnerVisible && <ChangeOwner
                    team={team}
                    visible={changeOwnerVisible}
                    setVisible={setChangeOwnerVisible}
                    getTeamUserList={getTeamUserList}
                    editorAction={editorAction}
                />}
                <Modal
                    title="编辑信息"
                    visible={editorVisible}
                    onCancel={() => setEditorVisible(false)}
                    footer={null}
                    className="editor-team-user"
                    style={{ width: '400px' }}
                    // autoFocus={false}
                    // focusLock={true}
                >
                    <div className="team-user-item">
                        <div className="team-user-item-title">手机号</div>
                        <div className="team-user-item-content">
                            <Input value={editorAction.phone} disabled />
                        </div>
                    </div>
                    <div className="team-user-item">
                        <div className="team-user-item-title">用户名</div>
                        <div className="team-user-item-content">
                            <Input value={editorAction.nick} disabled />
                        </div>
                    </div>
                    <div className="team-user-item">
                        <div className="team-user-item-title">邀请人</div>
                        <div className="team-user-item-content">
                            <Input value={editorAction.inviter} disabled />
                        </div>
                    </div>
                    <div className="team-user-item">
                        <div className="team-user-item-title">权限</div>
                        <div className="team-user-item-content">
                            <Select
                                allowClear
                                placeholder="请选择权限"
                                style={{ height: 32 }}
                                value={editorRole}
                                onChange={(val) => setEditorRole(val)}
                            >
                                {roles.map((d) => (
                                    <Option key={d.key} value={d.key}>
                                        {d.value}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="team-user-footer">
                        <Button type="secondary" onClick={() => setEditorVisible(false)}>
                            取消
                        </Button>
                        <Button
                            type="primary"
                            style={{ marginLeft: '16px' }}
                            onClick={submitEditor}
                        >
                            保存
                        </Button>
                    </div>
                </Modal>
            </Spin>
        </div>
    );
};

export default SpaceUsers;
