// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Link } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';
import Empty from 'antd/lib/empty';
import NoTasksIcon from '../../assets/no-tasks-icon.svg';

interface Props {
    notFound: boolean;
}

export default function EmptyListComponent(props: Props): JSX.Element {
    const { notFound } = props;
    return (
        <div className='cvat-empty-projects-list'>
          {/*  <Empty description={notFound ? (
                <Text strong>No results matched your search...</Text>
            ) : (
                <>
                    <Row justify='center' align='middle'>
                        <Col>
                            <Text strong>No projects created yet ...</Text>
                        </Col>
                    </Row>
                    <Row justify='center' align='middle'>
                        <Col>
                            <Text type='secondary'>To get started with your annotation project</Text>
                        </Col>
                    </Row>
                    <Row justify='center' align='middle'>
                        <Col>
                            <Link to='/projects/create'>create a new one</Link>
                        </Col>
                    </Row>
                </>
            )}
            />
            <div className='flex flex-row'>
                        {/* <NoTasksIcon/> */}




            <div className='flex flex-row mt-[210px] ml-[530px]'>
                <NoTasksIcon/>
                <Text style={{marginLeft:'5px',marginTop:'8px',color:'rgba(17, 24, 39, 0.6)',fontFamily:'Lexend'}}>No projects are currently available here, Initiate a new project from the sidebar</Text>
            </div>
        </div>
    );
}
