import React, { useState, useRef, useEffect } from 'react';
import {
    Input,
    Select,
    Button,
    Popconfirm,
    Table,
    Spin,
    Tooltip,
} from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import noteService from '../../service/note';
import AddTeam from '../components/AddTeam';
import TransferTeam from '../components/TransferTeam';
import EditorTeam from '../components/EditorTeam';

import './index.less';
const Option = Select.Option;

type transferAction = {
    identity_name?: string;
    inviter?: string;
    nick?: string;
    team_name?: string;
    profile?: string;
    school_name?: string;
    specialty_name?: string;
    user_id?: string;
};
const TeamManage = () => {
    const navigate = useNavigate();
    const team = {}
    
    const [teamName, setTeamName] = useState('');
    const [managerName, setManagerName] = useState('');
    const [data, setData] = useState([]);
    const [teamVisible, setTeamVisible] = useState(false);
    const [editorVisible, setEditorVisible] = useState(false);
    const [transferVisible, setTransferVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [transferAction, setTransferAction] = useState({});

    const [pagination, setPagination] = useState({
        total: 0,
        pageSize: 10,
        current: 1,
        showTotal: true,
        sizeCanChange: true,
        showJumper: true,
    });

    useEffect(() => {
        getTeamList();
    }, [page, pagination.pageSize]);

    useEffect(() => {
        setPage(1);
    }, [teamName, managerName]);

    const getTeamList = async () => {
        const res = await noteService.teamList({
            n: pagination.pageSize,
            p: page,
            team_name: teamName,
            manager_name: managerName,
        });
        if (res.code === 0 && res?.data?.list) {
            const arr = res.data.list.map((d: { profile: { school_name: any; specialty_name: any; position_name: any; }; }) => {
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


    const onChangeTable = async (pagination: { current: any; pageSize: any; }) => {
        const { current, pageSize } = pagination;
        setPagination((pagination) => ({
            ...pagination,
            pageSize,
        }));
        setPage(current);
    };

    const columns = [
        {
            title: '序号',
            render: (col: any, item: any, index: any) => {
                return index+1
            }
        },
        {
            title: '团队名称',
            dataIndex: 'name',
            render: (col: any, record: { name: any; }) => {
                const text = record?.name;
                return (
                    <Tooltip position="top" trigger="hover" content={text}>
                        <div
                            style={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                maxWidth: '150px',
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
            render: (col: any, record: { nick_name: any; }) => {
                const text = record?.nick_name;
                return (
                    <Tooltip position="top" trigger="hover" content={text}>
                        <div
                            style={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                maxWidth: '150px',
                            }}
                        >
                            {text}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            title: '超管手机号',
            dataIndex: 'phone',
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
        },
        {
            title: '团队成员数',
            dataIndex: 'total',
            render: (col: any, record: { team_id: any; total: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
                return <div style={{cursor: 'pointer', color: '#0675DB'}} onClick={() => navigate(`/team-users?team_id:${record.team_id}`, {state: record})}>{record.total}</div>
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (col: any, record: any) => {
                let disable = record.status === 1 ? false : true;
                return (
                    <span
                        style={{color: disable ? 'rgba(245, 63, 63, 1)' : 'rgba(0, 0, 0, 0.88)'}}
                    >
                        {disable ? '已禁用' : '已启用'}
                    </span>
                )
            },
        },
        {
            title: '操作',
            dataIndex: 'op',
            width: 200,
            render: (col: any, record: any) => {
                let disable = record.status === 1 ? false : true;
                return (
                    <div className="option-btn">
                        <span className="option-btn-normal" onClick={() => editorTeam(record)}>
                            编辑
                        </span>
                        <span className="option-btn-delete" onClick={() => transferTeam(record)}>移交</span>
                        <Popconfirm title={`确定要${disable ? '启用' : '禁用'}团队?`} onOk={() => disableTeam(record)}>
                            <span
                                className="option-btn-delete"
                                style={{color: disable ? 'rgba(6, 117, 219, 1)' : 'rgba(245, 63, 63, 1)'}}
                            >
                                {disable ? '启用' : '禁用'}
                            </span>
                        </Popconfirm>
                        
                    </div>
                )
            },
        },
    ];

    const editorTeam = async (record: React.SetStateAction<{}>) => {
        setEditorVisible(true);
        setTransferAction(record);
    };

    const transferTeam = async (record: React.SetStateAction<{}>) => {
        setTransferVisible(true);
        setTransferAction(record);
    };

    const disableTeam = async (record: any) => {
        const res = await noteService.teamStatus({
            team_id: record.team_id,
            status: record.status === 1 ? -1 : 1
        })
        if (res.code === 0) {
            getTeamList();
        }
        
    };

    const onSubmit = () => {
        getTeamList();
    };

    return (
        <div className="space-user">
            <Spin loading={team === null} style={{ width: '100%' }}>
                <div className="space-page-title">团队管理</div>

                <div className="space-block-title">团队列表</div>
                <div>
                    <div className="space-user-form">
                        <div className="space-user-form-add">
                            <Button type="primary" onClick={() => setTeamVisible(true)}>
                                <i className="keenote icon-keenote-block-plus" />
                                创建团队
                            </Button>
                        </div>
                        <div className="space-user-form-list">
                            <div>
                                <span>团队名称</span>
                                <span>
                                    <Input
                                        allowClear
                                        style={{ width: 180, height: 32 }}
                                        placeholder="请输入团队名称"
                                        value={teamName}
                                        onChange={(val) => setTeamName(val)}
                                    />
                                </span>
                            </div>
                            <div>
                                <span>管理员手机或名称</span>
                                <span>
                                    <Input
                                        allowClear
                                        style={{ width: 180, height: 32 }}
                                        placeholder="请输入管理员手机或名称"
                                        value={managerName}
                                        onChange={(val) => setManagerName(val)}
                                    />
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
                {transferVisible&&<TransferTeam
                    visible={transferVisible}
                    setVisible={setTransferVisible}
                    getTeamList={getTeamList}
                    action={transferAction}
                />}
                {editorVisible&&<EditorTeam
                    visible={editorVisible}
                    setVisible={setEditorVisible}
                    getTeamList={getTeamList}
                    action={transferAction}
                />}
            </Spin>
        </div>
    );
};

export default TeamManage;
