import React from 'react';
import ReactDOM from 'react-dom';
import '@arco-design/web-react/dist/css/arco.css';
// import '@arco-themes/react-keenote-01/css/arco.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './routers';

// import './assets/iconfont/iconfont.css';
// import './assets/iconfont/iconfont.js';


ReactDOM.render(
    <BrowserRouter>
        <Router />
    </BrowserRouter>,
    document.getElementById('root')
);
