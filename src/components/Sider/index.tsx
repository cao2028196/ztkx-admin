import { useState } from 'react';
import { Layout, Menu } from '@arco-design/web-react';
import './index.less';
import { useNavigate } from 'react-router-dom';
import router from '../../routers/config'

const MenuItem = Menu.Item;

const Sider = () => {
    const navigate = useNavigate();
    const routerList = () => {
        // console.log(router)
        return router.filter(d => d.hiddenMenu).map(d => <MenuItem key={d.path}>{d.name}</MenuItem>)
    }
    const collapsed = /mobile/i.test(navigator.userAgent)
    return (
        <div onContextMenu={(e) => e.preventDefault()}>
                <Layout.Sider
                    className="sider"
                    collapsed={collapsed}
                    // resizeDirections={['right']}
                >
                    <Menu
                        defaultOpenKeys={['1']}
                        defaultSelectedKeys={['0_3']}
                        onClickMenuItem={(key) =>
                            navigate(`${key}`)
                        }
                        style={{ width: '100%' }}
                >
                    {routerList()}
                </Menu>
                </Layout.Sider>
        </div>
    );
};

export default Sider;
