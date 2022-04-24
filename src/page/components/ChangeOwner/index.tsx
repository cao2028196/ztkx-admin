import {  Modal, Radio } from '@arco-design/web-react';
import { useState, useEffect, SetStateAction } from 'react';
import './index.less';
import noteService from '../../../service/note';

const RadioGroup = Radio.Group;

function ChangeOwner({ team, ...props }) {
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

    const changeOwner = () => {
        console.log(selected)
        props.setVisible(false);
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
