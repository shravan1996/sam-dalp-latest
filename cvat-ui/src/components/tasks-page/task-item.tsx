// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';
import Button from 'antd/lib/button';
import { MoreOutlined } from '@ant-design/icons';
import Dropdown from 'antd/lib/dropdown';
import Progress from 'antd/lib/progress';
import moment from 'moment';

import ActionsMenuContainer from 'containers/actions-menu/actions-menu';
import Preview from 'components/common/preview';
import { ActiveInference, PluginComponent } from 'reducers';
import AutomaticAnnotationProgress from './automatic-annotation-progress';

export interface TaskItemProps {
    taskInstance: any;
    deleted: boolean;
    hidden: boolean;
    activeInference: ActiveInference | null;
    taskNamePlugins: PluginComponent[];
    cancelAutoAnnotation(): void;
}

class TaskItemComponent extends React.PureComponent<TaskItemProps & RouteComponentProps> {
    private renderPreview(): JSX.Element {
        const { taskInstance } = this.props;
        return (
            <Col span={4}>
                <Preview
                    task={taskInstance}
                    loadingClassName='cvat-task-item-loading-preview'
                    emptyPreviewClassName='cvat-task-item-empty-preview'
                    previewWrapperClassName='cvat-task-item-preview-wrapper'
                    previewClassName='cvat-task-item-preview rounded-[12px]'
                />
            </Col>
        );
    }

    private renderDescription(): JSX.Element {
        // Task info
        const { taskInstance, taskNamePlugins } = this.props;
        const { id } = taskInstance;
        const owner = taskInstance.owner ? taskInstance.owner.username : null;
        const updated = moment(taskInstance.updatedDate).fromNow();
        const created = moment(taskInstance.createdDate).format('MMMM Do YYYY');

        // Get and truncate a task name
        const name = `${taskInstance.name.substring(0, 70)}${taskInstance.name.length > 70 ? '...' : ''}`;

        return (
            <Col span={10} className='cvat-task-item-description'>
                <Text strong type='secondary' className='cvat-item-task-id'>{`#${id}: `}</Text>
                <Text strong className='cvat-item-task-name'>
                    {name}
                </Text>
                { taskNamePlugins.map(({ component: Component }, index) => <Component key={index} />) }
                <br />
                {owner && (
                    <>
                        <Text type='secondary'>{`Created ${owner ? `by ${owner}` : ''} on ${created}`}</Text>
                        <br />
                    </>
                )}
                <Text type='secondary'>{`Last updated ${updated}`}</Text>
            </Col>
        );
    }

    private renderProgress(): JSX.Element {
        const { taskInstance, activeInference, cancelAutoAnnotation } = this.props;
        // Count number of jobs and performed jobs
        const numOfJobs = taskInstance.progress.totalJobs;
        const numOfCompleted = taskInstance.progress.completedJobs;

        // Progress appearance depends on number of jobs
        let progressColor = null;
        let progressText = null;
        if (numOfCompleted && numOfCompleted === numOfJobs) {
            progressColor = 'cvat-task-completed-progress';
            progressText = (
                <Text strong className={progressColor}>
                    Completed
                </Text>
            );
        } else if (numOfCompleted) {
            progressColor = 'cvat-task-progress-progress';
            progressText = (
                <Text strong className={progressColor}>
                    In Progress
                </Text>
            );
        } else {
            progressColor = 'cvat-task-pending-progress';
            progressText = (
                <Text strong className={progressColor}>
                    Pending
                </Text>
            );
        }

        const jobsProgress = numOfCompleted / numOfJobs;
        return (
            <Col span={6}>
                <Row justify='space-between' align='top'>
                <Col className='flex flex-row'>
                        <div className='flex flex-row'>
                            <svg height='8' width='8' className={`mt-[6px] ${progressColor}`}>
                                <circle cx='4' cy='4' r='4' strokeWidth='0' />
                            </svg>
                            {progressText}
                        </div>
                    </Col>
                    <Col>
                        <Text type='secondary'>{`${numOfCompleted}/${numOfJobs}`}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Progress
                            className={`${progressColor} cvat-task-progress`}
                            percent={jobsProgress * 100}
                            strokeColor='#1890FF'
                            showInfo={false}
                            strokeWidth={5}
                            size='small'
                        />
                    </Col>
                </Row>
                <AutomaticAnnotationProgress
                    activeInference={activeInference}
                    cancelAutoAnnotation={cancelAutoAnnotation}
                />
            </Col>
        );
    }

    private renderNavigation(): JSX.Element {
        const { taskInstance, history } = this.props;
        const { id } = taskInstance;

        return (
            <Col span={4}>
                <Row justify='end'>
                <Col className='flex flex-row'>
                        <Button
                            className='cvat-item-open-task-button rounded-[16px] mt-[5px]'
                            style={{color:'#023E8A',borderWidth:'0px',fontWeight:'bold'}}
                            // size='large'
                            // ghost
                            // href={`/tasks/${id}`}
                            onClick={(e: React.MouseEvent): void => {
                                e.preventDefault();
                                history.push(`/tasks/${id}`);
                            }}
                        >
                            Open
                        </Button>
                        <Dropdown overlay={<ActionsMenuContainer taskInstance={taskInstance} />}>
                            <Col className='cvat-item-open-task-actions' style={{color:'blue'}}>
                                {/* <Text className='cvat-text-color'>Actions</Text> */}
                                <MoreOutlined className='cvat-menu-icon' />
                            </Col>
                        </Dropdown>
                    </Col>
                </Row>
                {/*<Row justify='end'>
                    <Dropdown overlay={<ActionsMenuContainer taskInstance={taskInstance} />}>
                        <Col className='cvat-item-open-task-actions'>
                            <Text className='cvat-text-color'>Actions</Text>
                            <MoreOutlined className='cvat-menu-icon' />
                        </Col>
                    </Dropdown>
                        </Row>*/}
            </Col>
        );
    }

    public render(): JSX.Element {
        const { deleted, hidden } = this.props;
        const style = {};
        if (deleted) {
            (style as any).pointerEvents = 'none';
            (style as any).opacity = 0.5;
        }

        if (hidden) {
            (style as any).display = 'none';
        }

        return (
            <Row className='cvat-tasks-list-item ' justify='center' align='top' style={{ ...style,borderRadius:'7px',borderWidth:'0px',boxShadow: 'rgb(126, 150, 234) 0px 0px 3px 3px', }}>
                {this.renderPreview()}
                {this.renderDescription()}
                {this.renderProgress()}
                {this.renderNavigation()}
            </Row>
        );
    }
}

export default withRouter(TaskItemComponent);
