import React, { useState, useRef, useEffect } from 'react';
import {
    Input,
    Select,
    Button,
    Popconfirm,
    Table,
    Modal,
    Message,
    Spin,
    Tooltip,
} from '@arco-design/web-react';
import { TeamAvatar } from '../../components/Avatar';
import noteService from '../../service/note';
import AddTeamUser from '../components/AddTeamUser';
import AddTeamUsers from '../components/AddTeamUsers';
import './index.less';
// import styles from './styles.module.less';
// import { useCurrentTeam } from '@/hooks/useCurrentTeam';
// import { useUserContextValue } from '@/layout/WorkspaceLayout/contexts';
const Option = Select.Option;

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
    // const { user } = useUserContextValue();
    // const { team } = useCurrentTeam(user);
    const user = {}
    const team = {}


    const [data, setData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [teamUserVisible, setTeamUserVisible] = useState(false);
    const [teamUsersVisible, setTeamUsersVisible] = useState(false);
    const [editorVisible, setEditorVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [phone, setPhone] = useState('');
    const [nick, setNick] = useState('');
    const [role, setRole] = useState();
    const [editorRole, setEditorRole] = useState();
    const [editorAction, setEditorAction] = useState<editorAction>({ user_id: '' });
    // const [currentSpace, setCurrentSpace] = useState({
    //     name: '',
    //     icon_name: '',
    //     icon: '',
    //     role: 100,
    // });
    const [pagination, setPagination] = useState({
        total: 0,
        pageSize: 10,
        current: 1,
    });

    useEffect(() => {
        if (team) getTeamUserList();
    }, [team, page]);

    useEffect(() => {
        getTeamRoles();
    }, []);

    const getTeamRoles = async () => {
        const res = await noteService.getTeamRoles();
        if (res.code === 0) {
            setRoles(res.data.list);
        }
    };

    const getTeamUserList = async () => {
        const res = await noteService.getTeamMemberList({
            teamId: team.team_id,
            n: 10,
            p: page,
            phone,
            nick,
            role,
        });
        if (res.code === 0 && res?.data?.list) {
            const arr = res.data.list.map((d) => {
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

    const onChangeTable = async (pagination) => {
        const { current, pageSize } = pagination;
        setPage(current);
    };

    const onSubmit = () => {
        getTeamUserList();
    };

    const columns = [
        {
            title: '?????????',
            dataIndex: 'phone',
        },
        {
            title: '?????????',
            dataIndex: 'nick',
        },
        {
            title: '?????????',
            dataIndex: 'inviter',
        },
        {
            title: '??????',
            dataIndex: 'identity_name',
        },
        {
            title: '??????',
            dataIndex: 'school_name',
        },
        {
            title: '??????',
            dataIndex: 'specialty_name',
            width: 300,
            render: (col, record) => {
                const text = record?.specialty_name?.join(', ');
                return (
                    <Tooltip position="top" trigger="hover" content={text}>
                        <div
                            style={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                width: '350px',
                            }}
                        >
                            {text}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            title: '??????',
            dataIndex: 'role_name',
            editable: true,
        },
        {
            title: '??????',
            dataIndex: 'op',
            render: (col, record) => (
                <div className="option-btn">
                    <span className="option-btn-normal" onClick={() => editorUser(record)}>
                        ??????
                    </span>
                    <Popconfirm title="??????????????????????????????????" onOk={() => removeRow(record)}>
                        <span className="option-btn-delete">??????</span>
                    </Popconfirm>
                    {/* <Dropdown
                        droplist={
                            <Menu>
                                <Menu.Item key="1" onClick={() => removeRow(record)}>
                                    ??????
                                </Menu.Item>
                            </Menu>
                        }
                        trigger="click"
                        position="br"
                    >
                        <i className="keenote icon-keenote-more-fill" />
                    </Dropdown> */}
                </div>
            ),
        },
    ];
    const editorUser = (record) => {
        if (record.role === 100) {
            Message.info('????????????');
            return;
        }
        if (team.role >= record.role) {
            Message.info('?????????????????????');
            return;
        }
        setEditorVisible(true);
        setEditorRole(record.role);
        setEditorAction(record);
    };
    const removeRow = async (record) => {
        const res = await noteService.teamMemberRemove({
            team_id: team.team_id,
            uid: record.user_id,
        });
        getTeamUserList();
        Message.info(res.msg);
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
            <div className="space-page-title">????????????</div>
                <div className="space-name">
                    <div className="space-name-pic">
                         {team && (
                            <TeamAvatar
                                size={36}
                                src={team?.icon}
                                alt={team?.icon_name}
                                id={team?.team_id}
                                className="team-avatar"
                            />
                        )}
                    </div>
                    <div>{team?.name}</div>
                </div>

                <div className="space-block-title">????????????</div>
                <div className="space-user-form-list">
                    <div className="space-user-form">
                        <div className="space-user-form-add">
                            <Button type="primary" onClick={() => setTeamUserVisible(true)}>
                                <i className="keenote icon-keenote-block-plus" />
                                ???????????????
                            </Button>
                            <Button type="outline" onClick={() => setTeamUsersVisible(true)}>
                                ????????????
                            </Button>
                        </div>
                        <div className="space-user-form-list">
                            <div>
                                <span>?????????</span>
                                <span>
                                    <Input
                                        allowClear
                                        style={{ width: 240, height: 32 }}
                                        placeholder="??????????????????"
                                        value={phone}
                                        onChange={(val) => setPhone(val)}
                                    />
                                </span>
                            </div>
                            <div>
                                <span>?????????</span>
                                <span>
                                    <Input
                                        allowClear
                                        style={{ width: 120, height: 32 }}
                                        placeholder="???????????????"
                                        value={nick}
                                        onChange={(val) => setNick(val)}
                                    />
                                </span>
                            </div>
                            <div>
                                <span>??????</span>
                                <span>
                                    <Select
                                        allowClear
                                        placeholder="???????????????"
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
                                    ??????
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
                <AddTeamUser
                    team={team}
                    visible={teamUserVisible}
                    setVisible={setTeamUserVisible}
                    getTeamUserList={getTeamUserList}
                    roleList={roles}
                />
                <AddTeamUsers
                    team={team}
                    visible={teamUsersVisible}
                    setVisible={setTeamUsersVisible}
                    getTeamUserList={getTeamUserList}
                />
                <Modal
                    title="????????????"
                    visible={editorVisible}
                    onCancel={() => setEditorVisible(false)}
                    footer={null}
                    className="editor-team-user"
                    style={{ width: '400px' }}
                    // autoFocus={false}
                    // focusLock={true}
                >
                    <div className="team-user-item">
                        <div className="team-user-item-title">?????????</div>
                        <div className="team-user-item-content">
                            <Input value={editorAction.phone} disabled />
                        </div>
                    </div>
                    <div className="team-user-item">
                        <div className="team-user-item-title">?????????</div>
                        <div className="team-user-item-content">
                            <Input value={editorAction.nick} disabled />
                        </div>
                    </div>
                    <div className="team-user-item">
                        <div className="team-user-item-title">?????????</div>
                        <div className="team-user-item-content">
                            <Input value={editorAction.inviter} disabled />
                        </div>
                    </div>
                    <div className="team-user-item">
                        <div className="team-user-item-title">??????</div>
                        <div className="team-user-item-content">
                            <Input value={editorAction.identity_name} disabled />
                        </div>
                    </div>
                    <div className="team-user-item">
                        <div className="team-user-item-title">??????</div>
                        <div className="team-user-item-content">
                            <Input value={editorAction.school_name} disabled />
                        </div>
                    </div>
                    <div className="team-user-item">
                        <div className="team-user-item-title">??????</div>
                        <div className="team-user-item-content">
                            <Input value={editorAction.specialty_name} disabled />
                        </div>
                    </div>
                    <div className="team-user-item">
                        <div className="team-user-item-title">??????</div>
                        <div className="team-user-item-content">
                            <Select
                                allowClear
                                placeholder="???????????????"
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
                            ??????
                        </Button>
                        <Button
                            type="primary"
                            style={{ marginLeft: '16px' }}
                            onClick={submitEditor}
                        >
                            ??????
                        </Button>
                    </div>
                </Modal>
            </Spin>
        </div>
    );
};

export default SpaceUsers;
