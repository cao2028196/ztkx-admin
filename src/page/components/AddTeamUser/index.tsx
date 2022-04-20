import { Table, Input, Checkbox, Select, Message, Modal, Tooltip } from '@arco-design/web-react';
import { useState, useEffect, SetStateAction } from 'react';
// import { memberAdd, userSearch } from 'services/team';
import './index.less';
import noteService from '../../../service/note';
// import passport from '../../../../service/passport';
// import KXModal from 'components/KXModal';

const { Option } = Select;
const roleList = [
    {"key":200,"value":"管理员"},
    {"key":300,"value":"普通成员"}
]

function AddTeamUser({ team, ...props }) {
    const [searchText, setSearchText] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const [search, setSearch] = useState([]);

    const columns = [
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '成员昵称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '权限',
            dataIndex: 'role_name',
            key: 'role_name',
            editable: true,
            render: (_: any, record: any) => (
                <Select
                    defaultValue="普通成员"
                    style={{ width: 100 }}
                    onChange={(val) => selectRole(record, val)}
                >
                    {roleList.map((d) => (
                        <Option key={d.key} value={d.key}>
                            {d.value}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: '操作',
            dataIndex: 'op',
            key: 'address',
            render: (_: any, record: any) => (
                <span className="team-user-delete" onClick={() => userDelete(record)}>
                    移除
                </span>
            ),
        },
    ];

    const selectRole = (record: { phone: any; }, val: any) => {
        setDataSource((origin:any) =>
            origin.map((d:any) => {
                if (d.phone === record.phone) {
                    d.role = val;
                }
                return d;
            })
        );
    };

    const addUsers = async () => {
        const res = await noteService.teamMemberAdd({team_id: team.team_id, members: dataSource});
        if (res.code === 0) {
            props.setVisible(false);
            props.getTeamUserList();
            setDataSource([]);
            setSearch([]);
            setSearchText('');
            if (res.data.list.length > 0) {
                Message.info({
                    content: `团队成员 ${res.data.list
                        .map((d:any) => d.phone)
                        .toString()} 邀请失败，请重新操作!`,
                    icon: <i className="icon-KX-tishiicon_16" />,
                });
            }else {
                Message.success('添加成功')
            }
        }
    };

    const onSearch = async (val: SetStateAction<string>) => {
        setSearchText(val);
        // if (!val) {
        //     return;
        // }
        const res = await noteService.userSearch({p: 1, n: 20, keyword: val, team_id: team.team_id});
        // const res = await passport.userSearch(team.team_id, 10, 1, val);
        if (res && res.code === 0) {
            const list = res.data.list || [];
            for (let i = 0, len = list.length; i < len - 1; i++) {
                const arr = dataSource.filter((d:any) => d.phone === list[i].phone);
                if (arr.length === 1) {
                    list[i].checked = true;
                } else {
                    list[i].checked = false;
                }
            }
            setSearch(list);
        }
    };

    const onCheck = (checked:any, data) => {
        if (checked) {
            const arr = dataSource.slice();
            data.role = 300; // 默认普通用户
            data.identity = 2; // 默认学生
            arr.push(data);
            setDataSource(arr);
        } else {
            setDataSource((o) => o.filter((d:any) => d.phone !== data.phone));
        }
        const arr1 = search.map((d:any) => {
            if (d.phone === data.phone) {
                d.checked = checked;
            }
            return d;
        });
        setSearch(arr1);
    };

    const userDelete = (record:any) => {
        const arr = dataSource.filter((d:any) => d.phone !== record.phone);
        const arr1 = search.map((d:any) => {
            if (d.phone === record.phone) {
                d.checked = false;
            }
            return d;
        });
        setDataSource(arr);
        setSearch(arr1);
    };

    return (
        <Modal
            title="添加新成员"
            visible={props.visible}
            onCancel={() => {
                setDataSource([]);
                setSearch([]);
                setSearchText('');
                props.setVisible(false);
            }}
            onOk={() => addUsers()}
            okText="确认"
            style={{ width: '938px' }}
        >
            <div className="add-user">
                <div
                    className="add-user-item"
                    style={{
                        borderRight: '1px solid #E5E5E5',
                        paddingRight: '40px',
                        flex: 1,
                    }}
                >
                    <div className="add-user-search">
                        <Input
                            placeholder="输入昵称或手机号"
                            value={searchText}
                            allowClear
                            onChange={onSearch}
                        />
                    </div>
                    <div className="add-user-result" style={{ marginTop: '12px' }}>
                        <div className="add-user-result-title">
                            <div>手机号</div>
                            <div>昵称</div>
                        </div>
                        {search.map((d:any) => (
                            <div key={d.phone}>
                                <Checkbox
                                    checked={d.disable ? true : d.checked}
                                    disabled={d.disable}
                                    onChange={(value) => onCheck(value, d)}
                                >
                                    <span className="add-user-result-phone">{d.phone}</span>
                                    <Tooltip content={d.name}>
                                        <span className="add-user-result-name">{d.name}</span>
                                    </Tooltip>
                                </Checkbox>
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className="add-user-item"
                    style={{
                        paddingLeft: '40px',
                        width: '541px',
                    }}
                >
                    <div className="add-user-select">已选: {dataSource.length}人</div>
                    <Table data={dataSource} columns={columns} rowKey="phone" pagination={false} />
                </div>
            </div>
        </Modal>
    );
}

export default AddTeamUser;
