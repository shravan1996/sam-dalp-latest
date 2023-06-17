// Copyright (C) 2022-2023 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';

import React, { useEffect } from 'react';
import { Row, Col } from 'antd/lib/grid';
import Text from 'antd/lib/typography/Text';
import Spin from 'antd/lib/spin';
import { LoadingOutlined } from '@ant-design/icons'; // new
import { CombinedState } from 'reducers';
import { useSelector, useDispatch } from 'react-redux';
import { getModelProvidersAsync } from 'actions/models-actions';
import ModelForm from './model-form';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />; // new

function CreateModelPage(): JSX.Element {
    const dispatch = useDispatch();
    const fetching = useSelector((state: CombinedState) => state.models.providers.fetching);
    const providers = useSelector((state: CombinedState) => state.models.providers.list);
    useEffect(() => {
        dispatch(getModelProvidersAsync());
    }, []);

    return (
        <div className='cvat-create-model-page'>
            <Row justify='center' align='middle'>
                <Col>
                    <Text className='cvat-title'>Add a model</Text>
                </Col>
            </Row>
            {
                fetching ? (
                    <div className='cvat-empty-webhooks-list'>
                        <Spin indicator={antIcon} size='large' className='cvat-spinner' />
                    </div>
                ) : (
                    <Row justify='center' align='top'>
                        <Col md={20} lg={16} xl={14} xxl={9}>
                            <ModelForm providers={providers} />
                        </Col>
                    </Row>
                )
            }
        </div>
    );
}

export default React.memo(CreateModelPage);
