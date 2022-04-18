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
import { useNavigate } from 'react-router-dom';
import noteService from '../../service/note';
import AddTeam from '../components/AddTeam';
import TransferTeam from '../components/TransferTeam';

import './index.less';
// import styles from './styles.module.less';
// import { useCurrentTeam } from '@/hooks/useCurrentTeam';
// import { useUserContextValue } from '@/layout/WorkspaceLayout/contexts';
const Option = Select.Option;

type transferAction = {
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
    const navigate = useNavigate();
    const team = {}


    const [data, setData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [teamVisible, setTeamVisible] = useState(false);
    const [transferVisible, setTransferVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [transferAction, setTransferAction] = useState({});

    const [pagination, setPagination] = useState({
        total: 0,
        pageSize: 10,
        current: 1,
    });

    useEffect(() => {
        getTeamList();
    }, [page]);

    const getTeamList = async () => {
        const res = await noteService.teamList({
            n: 10,
            p: page,
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

    const columns = [
        {
            title: '序号',
            render: (col, item, index) => {
                return index
            }
        },
        {
            title: '团队名称',
            dataIndex: 'name',
            width: 300,
            render: (col, record) => {
                const text = record?.name;
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
            title: '超管用户名',
            dataIndex: 'nick_name',
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
        },
        {
            title: '团队成员数',
            dataIndex: 'total',
            render: (col, record) => {
                return <div style={{cursor: 'pointer', color: '#0675DB'}} onClick={() => navigate(`/team-users?team_id:${record.team_id}`, {state: record})}>{record.total}</div>
            }
        },
        {
            title: '操作',
            dataIndex: 'op',
            render: (col, record) => (
                <div className="option-btn">
                    {/* <span className="option-btn-normal" onClick={() => editorTeam(record)}>
                        编辑
                    </span> */}
                    <span className="option-btn-delete" onClick={() => transferTeam(record)}>移交</span>
                </div>
            ),
        },
    ];

    const transferTeam = async (record) => {
        setTransferVisible(true);
        setTransferAction(record);
    };
    return (
        <div className="space-user">
            <Spin loading={team === null} style={{ width: '100%' }}>
                <div className="space-page-title">团队管理</div>

                <div className="space-block-title">团队列表</div>
                <div className="space-user-form-list">
                    <div className="space-user-form">
                        <div className="space-user-form-add">
                            <Button type="primary" onClick={() => setTeamVisible(true)}>
                                <i className="keenote icon-keenote-block-plus" />
                                创建团队
                            </Button>
                        </div>
                        {/* <div className="space-user-form-list">
                            <div>
                                <span>手机号</span>
                                <span>
                                    <Input
                                        allowClear
                                        style={{ width: 240, height: 32 }}
                                        placeholder="请输入手机号"
                                        value={phone}
                                        onChange={(val) => setPhone(val)}
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
                        </div> */}
                    </div>
                    <div className="space-user-list">
                        <Table
                            data={data}
                            columns={columns}
                            rowKey={'team_id'}
                            className="table-demo-editable-cell"
                            pagination={pagination}
                            onChange={onChangeTable}
                        />
                    </div>
                </div>
                <AddTeam
                    visible={teamVisible}
                    setVisible={setTeamVisible}
                    getTeamList={getTeamList}
                />
                <TransferTeam
                    visible={transferVisible}
                    setVisible={setTransferVisible}
                    getTeamList={getTeamList}
                    action={transferAction}
                />
            </Spin>
        </div>
    );
};

export default SpaceUsers;
