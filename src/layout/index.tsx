import { Layout } from '@arco-design/web-react';
import Sider from '../components/Sider';
import './index.less';

/**
 * 工作区布局
 * @param props
 * @returns
 */
const WorkspaceLayout = (props: any) => {

    return (

        <Layout>
            <Layout.Header className="layout-header">运营后台</Layout.Header>
            <Layout className="workspace">
            <Sider />
            <Layout.Content className="workspace-container">
                {props.children}
            </Layout.Content></Layout>
        </Layout>
    );
};

export default WorkspaceLayout;
