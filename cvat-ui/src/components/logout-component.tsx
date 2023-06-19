// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import Spin from 'antd/lib/spin';
import { LoadingOutlined } from '@ant-design/icons'; // new
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { saveLogsAsync } from 'actions/annotation-actions';
import { logoutAsync } from 'actions/auth-actions';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />; // new

function LogoutComponent(): JSX.Element {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(saveLogsAsync()).then(() => {
            dispatch(logoutAsync()).then(() => {
                history.goBack();
            });
        });
    }, []);

    return (
        <div className='cvat-logout-page cvat-spinner-container'>
            {/* <Spin className='cvat-spinner' /> */}
            <Spin indicator={antIcon} size='large' className='cvat-spinner' /> // new
        </div>
    );
}

export default React.memo(LogoutComponent);
