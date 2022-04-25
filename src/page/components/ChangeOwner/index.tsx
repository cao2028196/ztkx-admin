import {  Modal, Radio, Message } from '@arco-design/web-react';
import { useState, useEffect, SetStateAction } from 'react';
import './index.less';
import noteService from '../../../service/note';

const RadioGroup = Radio.Group;

function ChangeOwner({ team, editorAction, ...props }) {
    const [selected, setSelected] = useState('');
    const [teamManagers, setTeamManagers] = useState([]);

    useEffect(() => {
        getTeamManagers()
    }, [])

    const getTeamManagers = async() => {
        const res = await noteService.teamManagers({
            team_id: team.team_id
        })
        if (res.code === 0) {
            setTeamManagers(res.data.list)
        }
    }

    const changeOwner = async() => {
        console.log(selected)
        const resp = await noteService.teamMemberRemove({
            team_id: team.team_id,
            owner: editorAction.user_id,
            receive: selected,
        });
        props.getTeamUserList();
        props.setVisible(false);
        Message.info(resp.msg);
    }
    return (
        <Modal
            title="页面拥有者变更"
            visible={props.visible}
            onCancel={() => {
                props.setVisible(false);
            }}
            onOk={() => changeOwner()}
            okText="确认"
            style={{ width: '520px' }}
        >
            <div>请选择以下一位管理员继承该成员笔记的权限</div>
            <div>
            <RadioGroup
                direction='vertical'
                defaultValue='a'
                value={selected}
                onChange={(val) => setSelected(val)}
                >
                    {teamManagers.map(d => <Radio key={d.uid} value={d.uid}>{d.name}</Radio>)}
                </RadioGroup>
            </div>
        </Modal>
    );
}

export default ChangeOwner;
