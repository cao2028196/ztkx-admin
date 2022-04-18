import { Table, Input, Button, Select, Message, Modal, Form } from '@arco-design/web-react';
import { useState, useEffect } from 'react';
import './index.less';
import noteService from '../../../service/note';
import { useNavigate } from 'react-router-dom';

const FormItem = Form.Item;
const { Option } = Select;
const options = [
    { name: '全部成员仅可编辑查看本人创建页面', value: 'aa' },
    { name: '全部成员可查看', value: 'r' },
    { name: '全部成员可阅读', value: 'l' },
    { name: '全部成员可编辑', value: 'w' },
];

function TransferTeam({ ...props }) {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [userList, setUserList] = useState([])
    const [p, setP] = useState(1);
    const [keyword, setKeyword] = useState('');
    const n = 10;
    let onScrollLoad = true;
    const onSubmit = async (v) => {
        // const param = { type: 'public', ...v };
        const perm = v.perm === 'aa' ? '' : v.perm;
        props.setVisible(false)
        const res = await noteService.teamTransfer({team_id: props.action.team_id, receive: v.receive, owner: props.action.uid});
        if (res.code === 0) {
            props.getTeamList()
            Message.success('移交团队成功');
            form.resetFields()
        } else {
            Message.error('移交团队失败');
        }
    };

    const onSearchUsers = async () => {
        setUserList([]);
        setKeyword(keyword);
        const {code, data} = await noteService.teamMemberList({ p: 1, n, team_id: props.action.team_id });
        if (code === 0) {
            setUserList(data.list);
        }
    };

    const popupScrollHandler = async (el) => {
        const { scrollTop, scrollHeight, clientHeight } = el;
        const scrollBottom = scrollHeight - (scrollTop + clientHeight);
        if (scrollBottom < 10 && onScrollLoad) {
            onScrollLoad = false;
            const {code, data} = await noteService.teamMemberList({ p: p + 1, n, team_id: props.action.team_id });
            if (code === 0) {
                setP(p + 1);
                const arr = userList.concat(data.list);
                setUserList(arr);
                onScrollLoad = true;
            }
            
        } else {
        }
    };

    useEffect(() => {
        onSearchUsers()
        form.resetFields()
    }, [props.action])

    return (
        <Modal
            title="移交团队"
            visible={props.visible}
            onCancel={() => {
                props.setVisible(false);
            }}
            footer={null}
            style={{ width: '400px' }}
        >
            <Form
                form={form}
                onSubmit={(v) => {
                    onSubmit(v);
                }}
            >
                <div className='team-name'>
                    团队名称：{props.action.name}
                </div>
                <div>
                    每个团队只有1位所有者，移交后原超级管理员将变为管理员
                </div>
                <FormItem
                    field="receive"
                    rules={[
                        { required: true, message: '请输入团队拥有者' },
                    ]}
                    wrapperCol={{ span: 24 }}
                >
                    <Select
                        placeholder="请输入团队拥有者"
                        showSearch
                        filterOption={false}
                        onPopupScroll={popupScrollHandler}
                        onSearch={onSearchUsers}
                        getPopupContainer={(node) => node}
                    >
                        {userList?.map((d) => (
                            <Option key={d.user_id} value={d.user_id}>
                                {d.nick}
                            </Option>))}
                    </Select>
                </FormItem>
                <div className="creat-space-footer-button">
                    {/* <Button type="outline">重新选择</Button> */}
                    <Button type="primary" htmlType="submit">
                        确认
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default TransferTeam;
