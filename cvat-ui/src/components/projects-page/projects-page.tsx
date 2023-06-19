// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/lib/spin';
import { LoadingOutlined } from '@ant-design/icons'; // new
import { CombinedState, Indexable } from 'reducers';
import { getProjectsAsync } from 'actions/projects-actions';
import FeedbackComponent from 'components/feedback/feedback';
import { updateHistoryFromQuery } from 'components/resource-sorting-filtering';
import EmptyListComponent from './empty-list';
import TopBarComponent from './top-bar';
import ProjectListComponent from './project-list';

export default function ProjectsPageComponent(): JSX.Element {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />; // new
    const dispatch = useDispatch();
    const history = useHistory();
    const fetching = useSelector((state: CombinedState) => state.projects.fetching);
    const count = useSelector((state: CombinedState) => state.projects.current.length);
    const query = useSelector((state: CombinedState) => state.projects.gettingQuery);
    const tasksQuery = useSelector((state: CombinedState) => state.projects.tasksGettingQuery);
    const importing = useSelector((state: CombinedState) => state.import.projects.backup.importing);
    const [isMounted, setIsMounted] = useState(false);
    const [modal,setModal]=useState(false)

    const pull_data = (data:any) => {
       setModal(data);
      }

    const anySearch = Object.keys(query).some((value: string) => value !== 'page' && (query as any)[value] !== null);

    const queryParams = new URLSearchParams(history.location.search);
    const updatedQuery = { ...query };
    for (const key of Object.keys(updatedQuery)) {
        (updatedQuery as Indexable)[key] = queryParams.get(key) || null;
        if (key === 'page') {
            updatedQuery.page = updatedQuery.page ? +updatedQuery.page : 1;
        }
    }

    useEffect(() => {
        dispatch(getProjectsAsync({ ...updatedQuery }));
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            history.replace({
                search: updateHistoryFromQuery(query),
            });
        }
    }, [query]);

    const content =  count && !modal ? <ProjectListComponent modal={modal} /> : <EmptyListComponent notFound={anySearch} />;

    return (
        <div className={'cvat-projects-page flex flex-col justify-start'}>
        <div>
            <TopBarComponent
                func={pull_data}
                onApplySearch={(search: string | null) => {
                    dispatch(
                        getProjectsAsync({
                            ...query,
                            search,
                            page: 1,
                        }, { ...tasksQuery, page: 1 }),
                    );
                }}
                onApplyFilter={(filter: string | null) => {
                    dispatch(
                        getProjectsAsync({
                            ...query,
                            filter,
                            page: 1,
                        }, { ...tasksQuery, page: 1 }),
                    );
                }}
                onApplySorting={(sorting: string | null) => {
                    dispatch(
                        getProjectsAsync({
                            ...query,
                            sort: sorting,
                            page: 1,
                        }, { ...tasksQuery, page: 1 }),
                    );
                }}
                query={updatedQuery}
                importing={importing}

            />
        </div>

        <div>
            { fetching ? (
                    <div className='cvat-empty-project-list'>
                        <Spin indicator={antIcon} size='large' className='cvat-spinner' />
                    </div>
                ) :  content}
        </div>

            <FeedbackComponent />
        </div>
    );
}
