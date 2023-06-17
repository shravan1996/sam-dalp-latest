// Copyright (C) 2021-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';

import Empty from 'antd/lib/empty';
import { Row, Col } from 'antd/lib/grid';
import Text from 'antd/lib/typography/Text';
import { CloudOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import NoCloudIcon from '../../assets/no-cloud-icon.svg';

interface Props {
    notFound: boolean;
}

export default function EmptyStoragesListComponent(props: Props): JSX.Element {
    const { notFound } = props;

    const description = notFound ? (
        <Row justify='center' align='middle'>
            <Col style={{fontFamily:'Lexend'}}>
                <Text strong>No results matched your search found...</Text>
            </Col>
        </Row>
    ) : (
        <div className='flex ml-[300px] mt-[100px]'>
            <Row justify='center' align='middle'>
                <NoCloudIcon className='cvat-empty-cloud-storages-list-icon' />
            </Row>
            <Row justify='center' align='middle'>
                <Col className='flex flex-col' style={{fontFamily:'Lexend',marginLeft:'10px'}}>
                    <Text  type='secondary' >There are no cloud storages attached yet </Text>
                    <Text type='secondary'>To get started, Attach a  <Link to='/cloudstorages/create'>new cloud storage</Link></Text>
                </Col>
            </Row>
            {/*<Row justify='center' align='middle'>
                <Col>
                    <Link to='/cloudstorages/create'>attach a new one</Link>
                </Col>
            </Row> */}
        </div>
    );

    return (
        <div className='cvat-empty-cloud-storages-list'>
            {/* <Empty description={description} image={<CloudOutlined className='cvat-empty-cloud-storages-list-icon' />} /> */}
            <Empty
              description={description}
              image={<NoCloudIcon className='cvat-empty-cloud-storages-list-icon'
              style={{display:'none'}}/>}
            />
        </div>
    );
}
