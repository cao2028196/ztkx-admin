import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import noteService from '../../service/note';

const FeishuLogin = () => {
    const {search} = useLocation()
    const navigate = useNavigate()
    const params = qs.parse(search.split('?')[1])
    
    useEffect(() => {
        login()
    }, [])

    const login = async() => {
        const {code, state} = params
        if (!code || !state) return 
        const res = await noteService.accountLogin({code, state});
        if (res.code === 0) {
            localStorage.setItem('token', res.data.token)
            navigate('/')
        }
    }
    return (
        <div className="space-user">
            
        </div>
    );
};

export default FeishuLogin;
