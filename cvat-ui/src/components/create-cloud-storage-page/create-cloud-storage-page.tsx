// Copyright (C) 2021-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Text from 'antd/lib/typography/Text';

import CreateCloudStorageForm from './cloud-storage-form';

export default function CreateCloudStoragePageComponent(): JSX.Element {
    return (
        <Row  align='top' className='cvat-attach-cloud-storage-form-wrapper'>
            <Col style={{marginLeft:'100px'}} md={20} lg={16} xl={14} xxl={9}>
                <Text className='cvat-title' style={{lineHeight:'32px'}}>Create new cloud storage</Text>
                <CreateCloudStorageForm />
            </Col>
        </Row>
    );
}
