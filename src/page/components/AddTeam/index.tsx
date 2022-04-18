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

function AddTeam({ ...props }) {
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
        const res = await noteService.teamCreate({type: 'public', name: v.name, perm, uid: v.uid});
        console.log(res)
        if (res.code === 0) {
            props.getTeamList()
            Message.success('创建团队成功');
            form.resetFields()
        } else {
            Message.error('创建团队失败');
        }
    };

    const onSearchUsers = async (keyword) => {
        setUserList([]);
        setKeyword(keyword);
        const {code, data} = await noteService.userSearch({ p: 1, n, keyword });
        if (code === 0) {
            setUserList(data.list);
        }
    };

    const popupScrollHandler = async (el) => {
        const { scrollTop, scrollHeight, clientHeight } = el;
        const scrollBottom = scrollHeight - (scrollTop + clientHeight);
        if (scrollBottom < 10 && onScrollLoad) {
            onScrollLoad = false;
            const {code, data} = await noteService.userSearch({ p: p + 1, n, keyword });
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
    }, [])

    return (
        <Modal
            title="添加团队"
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
                <FormItem
                    field="name"
                    rules={[
                        { required: true, message: '请输入团队名称' },
                        { maxLength: 20, message: '团队名称不得超过20字符' },
                    ]}
                    wrapperCol={{ span: 24 }}
                >
                    <Input
                        placeholder="请输入团队名称"
                        autoComplete="off"
                    />
                </FormItem>
                <FormItem
                    field="perm"
                    rules={[{ required: true, message: '请选择初始页面权限' }]}
                    wrapperCol={{ span: 24 }}
                >
                    <Select
                        placeholder="请选择初始页面权限"
                    >
                        {options.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.name}
                            </Option>
                        ))}
                    </Select>
                </FormItem>
                <FormItem
                    field="uid"
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
                            <Option key={d.uid} value={d.uid}>
                                {d.name}
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

export default AddTeam;