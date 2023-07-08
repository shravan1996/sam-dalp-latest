// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Text from 'antd/lib/typography/Text';
import Card from 'antd/lib/card';
import Meta from 'antd/lib/card/Meta';
import Dropdown from 'antd/lib/dropdown';
import Button from 'antd/lib/button';
import { MoreOutlined } from '@ant-design/icons';

import { CombinedState, Project } from 'reducers';
import { useCardHeightHOC } from 'utils/hooks';
import Preview from 'components/common/preview';
import ProjectActionsMenuComponent from './actions-menu';

interface Props {
    projectInstance: Project;
    modalValue:Boolean;
}

const useCardHeight = useCardHeightHOC({
    containerClassName: 'cvat-projects-page',
    siblingClassNames: ['cvat-projects-pagination', 'cvat-projects-page-top-bar'],
    paddings: 40,
    numberOfRows: 3,
});

export default function ProjectItemComponent(props: Props): JSX.Element {
    const {
        projectInstance: instance,
    } = props;

    console.log(props.modalValue);

    const history = useHistory();
    const height = useCardHeight();
    const ownerName = instance.owner ? instance.owner.username : null;
    const updated = moment(instance.updatedDate).fromNow();
    const deletes = useSelector((state: CombinedState) => state.projects.activities.deletes);
    const deleted = instance.id in deletes ? deletes[instance.id] : false;

    const onOpenProject = (): void => {
        history.push(`/projects/${instance.id}`);
    };

    const style: React.CSSProperties = { height };
    if (deleted) {
        style.pointerEvents = 'none';
        style.opacity = 0.5;
    }

    return (
        <div >
        <Card
            cover={(
                <div style={{display:'flex',justifyContent:'space-between'}}>

                    <div style={{width:'200px'}}>

                        <Preview
                            project={instance}
                            loadingClassName='cvat-project-item-loading-preview'
                            emptyPreviewClassName='cvat-project-item-empty-preview'
                            previewWrapperClassName='cvat-projects-project-item-card-preview-wrapper'
                            previewClassName='cvat-projects-project-item-card-preview rounded-[18px]'
                            onClick={onOpenProject}

                        />

                    </div>
                    <div>
                        <Dropdown overlay={<ProjectActionsMenuComponent projectInstance={instance} />}>
                            <Button className='cvat-project-details-button' type='link' size='large' icon={<MoreOutlined />} />
                        </Dropdown>
                    </div>
                </div>

            )}

            size='small'
            style={{width:'300px',height:'280px',boxShadow: 'rgb(126, 150, 234) 0px 0px 3px 3px', fontFamily:'Lexend',padding:'12px',borderRadius:'10px',marginRight:'30px',marginBottom:'30px', display:'flex',flexDirection:'column',justifyContent:'space-between'}}
            className={'cvat-projects-project-item-card ' + props.modalValue ? 'backdrop-blur-sm inset-0 bg-black bg-opacity-60 ' : ''}
        >
            <div className='-ml-[10px]' >

                <Meta

                    title={(
                        <span onClick={onOpenProject} className='cvat-projects-project-item-title' aria-hidden>
                            {instance.name}
                        </span>
                    )}
                    description={(
                        <div className='cvat-projects-project-item-description' style={{display:'flex',justifyContent:'space-between'}}>
                            <div>
                                {ownerName && (
                                    <>
                                        <Text type='secondary'>{`Created ${ownerName ? `by ${ownerName}` : ''}`}</Text>
                                        <br />
                                    </>
                                )}
                                <Text type='secondary'>{`Last updated ${updated}`}</Text>
                            </div>

                        </div>
                    )}
                />
            </div>
        </Card>

    </div>

    );
}
