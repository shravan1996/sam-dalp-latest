// Copyright (C) 2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Spin, { SpinProps } from 'antd/lib/spin';
import { LoadingOutlined } from '@ant-design/icons'; // new

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />; // new

function CVATLoadingSpinner(props: SpinProps): JSX.Element {
    return (
        <div className='cvat-spinner-container'>
            {/* <Spin className='cvat-spinner' {...props} /> */}
            <Spin {...props} indicator={antIcon} size='large' className='cvat-spinner' />
        </div>
    );
}

export default React.memo(CVATLoadingSpinner);
