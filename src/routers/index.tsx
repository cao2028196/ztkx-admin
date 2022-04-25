import { useEffect } from 'react';

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
