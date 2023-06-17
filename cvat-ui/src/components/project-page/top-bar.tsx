// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { useHistory } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
import { LeftOutlined, MoreOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Text from 'antd/lib/typography/Text';

import { Project } from 'reducers';
import ActionsMenu from 'components/projects-page/actions-menu';

interface DetailsComponentProps {
    projectInstance: Project;
}

export default function ProjectTopBar(props: DetailsComponentProps): JSX.Element {
    const { projectInstance } = props;

    const history = useHistory();

    return (
        <Row className='cvat-task-top-bar ml-0' justify='space-between' align='middle'>
                <Col className='cvat-project-top-bar-actions'>
                    <Dropdown overlay={<ActionsMenu projectInstance={projectInstance} />}>
                        <Button size='middle' className='cvat-project-page-actions-button'>
                            <Text className='cvat-text-color'>Actions</Text>
                            <MoreOutlined className='cvat-menu-icon' />
                        </Button>
                    </Dropdown>
                </Col>

                <Col>
                    <Button
                        className='cvat-back-to-projects-button'
                        onClick={() => history.push('/projects')}
                        type='link'
                        style={{color:'#023E8A',textDecoration:'underline'}}
                        size='large'
                    >
                        {/* <LeftOutlined style={{color:'#023E8A'}}/> */}
                        Back to projects
                    </Button>
                </Dropdown>
            </Col>
            </Col>
        </Row>
    );
}
