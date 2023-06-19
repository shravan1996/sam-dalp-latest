// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Link } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';

import { TasksQuery } from 'reducers';
import Empty from 'antd/lib/empty';
import NoTasksIcon from '../../assets/no-tasks-icon.svg';

interface Props {
    query: TasksQuery;
}

function EmptyListComponent(props: Props): JSX.Element {
    const { query } = props;

    return (
        <div className='cvat-empty-tasks-list'>
            {/* <Empty  description={!query.filter && !query.search && !query.page ? (
                <>
                    <Row justify='center' align='middle'>
                        <Col>
                            <Text strong>No tasks created yet ...</Text>
                        </Col>
                    </Row>
                    <Row justify='center' align='middle'>
                        <Col>
                            <Text type='secondary'>To get started with your annotation project</Text>
                        </Col>
                    </Row>
                    <Row justify='center' align='middle'>
                        <Col>
                            <Link to='/tasks/create'>create a new task</Link>
                            <Text type='secondary'> or try to </Text>
                            <Link to='/projects/create'>create a new project</Link>
                        </Col>
                    </Row>
                </>
            ) : (
                    <div className='flex flex-row'>
                        <NoTasksIcon/>
                        <Text style={{marginLeft:'5px',color:'rgba(17, 24, 39, 0.6)',fontFamily:'Lexend'}}>No tasks are currently available here, Initiate a new task from the sidebar</Text>

                    </div>

                )}
            /> */}

                    <div className='flex flex-row mt-[210px] ml-[530px]'>
                        <NoTasksIcon/>
                        <Text style={{marginLeft:'5px',marginTop:'8px',color:'rgba(17, 24, 39, 0.6)',fontFamily:'Lexend'}}>No tasks are currently available here, Initiate a new task from the sidebar</Text>
                    </div>


        </div>
    );
}

export default React.memo(EmptyListComponent);
