import { useEffect } from 'react';

import routerConfig from './config';
import { Routes, Route } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import noteService from '../service/note';

export default function Router() {
    const {search} = useLocation()
    const navigate = useNavigate()
    const params = qs.parse(search.split('?')[1])
    
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            login()
        }
    }, [])
    // const team_id = search.split(':')[1]

    const login = async() => {
        const {code, state} = params
        if (!code || !state) return 
        const res = await noteService.accountLogin({code, state});
        if (res.code === 0) {
            localStorage.setItem('token', res.data.token)
            navigate('/')
        }
    }

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
