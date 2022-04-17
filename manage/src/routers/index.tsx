/*
 * @message: ~
 * @Version: 1.0
 * @Author: Huangxianwei
 * @since: 2021-05-28 11:21:54
 * @LastAuthor: Huangxianwei
 * @lastTime: 2021-12-06 10:26:37
 * @FilePath: /library/packages/web/src/routers/index.tsx
 * 代码如果有bug，自求多福 😊
 */
import routerConfig from './config';
import { Routes, Route } from 'react-router-dom';
export default function Router() {
    const routerList: Array<any> = [];
    const allRouter = [...routerConfig];
    allRouter.forEach((item) => {
        let Component = item.component;
        if (item.layout) {
            const Layout = item.layout;
            routerList.push(
                <Route
                    key={item.path}
                    path={item.path}
                    element={
                        <Layout>
                            <Component />
                        </Layout>
                    }
                />
            );
        } else {
            routerList.push(<Route key={item.path} path={item.path} element={<Component />} />);
        }
    });

    return <Routes>{routerList}</Routes>;
}
