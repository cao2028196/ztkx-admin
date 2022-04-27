import React, { useState, useRef, useEffect } from 'react';
import { Upload, Table, Modal, Message } from '@arco-design/web-react';
import './index.less';
import noteService from '../../../service/note';

type result = {
    result?: boolean;
    total?: number;
    errorList?: Array<any>;
};

function AddTeamUsers({ team, ...props }) {
    const [resultVisible, setResultVisible] = useState(false);
    const [resultData, setResultData] = useState<result>({});

    const downloadTemplate = () => {
        window.open('https://file1.kxsz.net/note/team.xlsx');
    };

    const onUpload = async (files:any) => {
        if (files[0].status === 'uploading') {
            const formData = new FormData();
            formData.append('file', files[0].originFile);
            formData.append('team_id', team.team_id);
            const res = await noteService.teamMemberMulti(formData);
            props.setVisible(false);
            props.getTeamUserList();

            if (res.code === 2) {
                Modal.info({ title: "上传错误", content: "文件格式错误，请参照模板文件" });
            }
            if (res.code !== 0 && res.code !== 1) {
                Modal.info({ title: `上传错误: ${res.msg}` });
                return;
            }
            if (res.code === 0 && res.data.error_list?.length === 0) {
                setResultData({
                    result: true,
                    total: res.data.count,
                    errorList: res.data.error_list,
                });
            }
            if (res.data?.error_list?.length > 0 || res.code !== 0) {
                setResultData({
                    result: false,
                    total: res.data?.count,
                    errorList: res.data?.error_list,
                });
            }
            setResultVisible(true);
        }
    };
    const columns = [
        {
            title: '手机号',
            dataIndex: 'phone',
        },
        {
            title: '错误提示',
            dataIndex: 'error_msg',
        },
    ];
    return (
        <>
            <Modal
                title="批量添加新成员"
                visible={props.visible}
                footer={null}
                onCancel={() => {
                    props.setVisible(false);
                }}
                style={{ width: '612px' }}
            >
                <div>
                    <Upload
                        drag
                        limit={1}
                        fileList={[]}
                        onChange={onUpload}
                        accept=".xlsx"
                        // action="/teamMemberMulti"
                        tip="支持上传 .xlsx 文件"
                    />
                </div>
                <div className="footer">
                    <span className="footer-text" onClick={() => downloadTemplate()}>
                        点击下载成员信息模板.xlsx
                    </span>
                </div>
            </Modal>
            <Modal
                title="批量添加新成员"
                visible={resultVisible}
                cancelText="继续邀请"
                okText="完成"
                onCancel={() => {
                    setResultVisible(false);
                    props.setVisible(true);
                }}
                onOk={() => setResultVisible(false)}
                maskClosable={false}
                closable={false}
                style={{ width: '612px' }}
            >
                <div className="add-user-result-icon">
                    <span
                        style={{
                            background: resultData.result ? '#E8FFEA' : '#FFF7E8',
                        }}
                    >
                        <i
                            style={{
                                fontSize: '56px',
                                color: resultData.result ? '#00B42A' : '#FF7D00',
                            }}
                            className={`keenote ${
                                resultData.result ? 'icon-keenote-Success' : 'icon-keenote-Warning'
                            }`}
                        />
                    </span>
                </div>
                <div className="add-user-result-text">
                    <div>本次共提交{resultData?.total}条成员信息</div>
                    <div>
                        其中 {resultData?.errorList?.length}{' '}
                        条提交信息错误，请修改完重新提交。错误提示如下：
                    </div>
                </div>
                {resultData.result ? (
                    ''
                ) : (
                    <div className="add-user-result-error">
                        <div style={{ marginBottom: '8px' }}>
                            共
                            <span style={{ color: '#2F90EA', margin: '0 2px' }}>
                                {resultData?.errorList?.length}
                            </span>
                            条记录
                        </div>
                        <div>
                            {resultData?.errorList && <Table rowKey="line" columns={columns} data={resultData?.errorList} />}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default AddTeamUsers;
