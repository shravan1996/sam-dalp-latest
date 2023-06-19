// Copyright (C) 2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/lib/spin';
import { LoadingOutlined } from '@ant-design/icons'; // new
import { Col, Row } from 'antd/lib/grid';
import Pagination from 'antd/lib/pagination';
import Empty from 'antd/lib/empty';
import Text from 'antd/lib/typography/Text';

import FeedbackComponent from 'components/feedback/feedback';
import { updateHistoryFromQuery } from 'components/resource-sorting-filtering';
import { CombinedState, Indexable } from 'reducers';
import { getJobsAsync } from 'actions/jobs-actions';

import TopBarComponent from './top-bar';
import JobsContentComponent from './jobs-content';
import NoTasksIcon from '../../assets/no-tasks-icon.svg';

function JobsPageComponent(): JSX.Element {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />; // new
    const dispatch = useDispatch();
    const history = useHistory();
    const [isMounted, setIsMounted] = useState(false);
    const query = useSelector((state: CombinedState) => state.jobs.query);
    const fetching = useSelector((state: CombinedState) => state.jobs.fetching);
    const count = useSelector((state: CombinedState) => state.jobs.count);

    const [modal,setModal]=useState(false)

    const pull_data = (data:any) => {
       setModal(data);
    }

    const queryParams = new URLSearchParams(history.location.search);
    const updatedQuery = { ...query };
    for (const key of Object.keys(updatedQuery)) {
        (updatedQuery as Indexable)[key] = queryParams.get(key) || null;
        if (key === 'page') {
            updatedQuery.page = updatedQuery.page ? +updatedQuery.page : 1;
        }
    }

    useEffect(() => {
        dispatch(getJobsAsync({ ...updatedQuery }));
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            history.replace({
                search: updateHistoryFromQuery(query),
            });
        }
    }, [query]);

    const content = count && !modal ? (
        <>
            <JobsContentComponent />
            <Row justify='space-around' about='middle'>
                <Col md={22} lg={18} xl={16} xxl={16}>
                    <Pagination
                        className='cvat-jobs-page-pagination'
                        onChange={(page: number) => {
                            dispatch(getJobsAsync({
                                ...query,
                                page,
                            }));
                        }}
                        showSizeChanger={false}
                        total={count}
                        pageSize={12}
                        current={query.page}
                        showQuickJumper
                    />
                </Col>
            </Row>
        </>
    ) : <div className='flex flex-row mt-[210px] justify-center self-center '>
            <NoTasksIcon className='mb-[10px]'/>
            <Text style={{marginLeft:'5px',marginTop:'8px',color:'rgba(17, 24, 39, 0.6)',fontFamily:'Lexend'}}>No jobs are currently available here.</Text>
        </div>;

    return (
        <div className='cvat-jobs-page'>
            <TopBarComponent
                func={pull_data}
                query={updatedQuery}
                onApplySearch={(search: string | null) => {
                    dispatch(
                        getJobsAsync({
                            ...query,
                            search,
                            page: 1,
                        }),
                    );
                }}
                onApplyFilter={(filter: string | null) => {
                    dispatch(
                        getJobsAsync({
                            ...query,
                            filter,
                            page: 1,
                        }),
                    );
                }}
                onApplySorting={(sorting: string | null) => {
                    dispatch(
                        getJobsAsync({
                            ...query,
                            sort: sorting,
                            page: 1,
                        }),
                    );
                }}
            />
            { fetching ? (
                // <Spin size='large' className='cvat-spinner' />
                <Spin indicator={antIcon} size='large' className='cvat-spinner' /> // new
            ) : content }
            <FeedbackComponent />
        </div>
    );
}

export default React.memo(JobsPageComponent);
