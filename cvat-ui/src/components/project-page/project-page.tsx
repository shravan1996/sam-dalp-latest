// Copyright (C) 2019-2022 Intel Corporation
// Copyright (C) 2022-2023 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import Spin from 'antd/lib/spin';
import { LoadingOutlined } from '@ant-design/icons'; // new
import { Row, Col } from 'antd/lib/grid';
import Result from 'antd/lib/result';
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Title from 'antd/lib/typography/Title';
import Pagination from 'antd/lib/pagination';
import { MultiPlusIcon } from 'icons';
import { PlusOutlined } from '@ant-design/icons';
import Empty from 'antd/lib/empty';
import Input from 'antd/lib/input';
import notification from 'antd/lib/notification';

import { getCore, Project, Task } from 'cvat-core-wrapper';
import { CombinedState, Indexable } from 'reducers';
import { getProjectTasksAsync } from 'actions/projects-actions';
import { cancelInferenceAsync } from 'actions/models-actions';
import CVATLoadingSpinner from 'components/common/loading-spinner';
import TaskItem from 'components/tasks-page/task-item';
import MoveTaskModal from 'components/move-task-modal/move-task-modal';
import ModelRunnerDialog from 'components/model-runner-modal/model-runner-dialog';
import {
    SortingComponent, ResourceFilterHOC, defaultVisibility, updateHistoryFromQuery,
} from 'components/resource-sorting-filtering';
import CvatDropdownMenuPaper from 'components/common/cvat-dropdown-menu-paper';

import DetailsComponent from './details';
import ProjectTopBar from './top-bar';

import {
    localStorageRecentKeyword, localStorageRecentCapacity, predefinedFilterValues, config,
} from './project-tasks-filter-configuration';

import DalpListIcon from '../../assets/dalp-list-icon.svg';
import CreateTask from '../../assets/create-task.svg';
import  ModalCloseIcon  from '../../assets/modal-close-icon.svg'; // importing x icon.
import DalpLogo from '../../assets/cvat-logo.svg'  // importing dalp logo
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const core = getCore();

const FilteringComponent = ResourceFilterHOC(
    config, localStorageRecentKeyword, localStorageRecentCapacity, predefinedFilterValues,
);

interface ParamType {
    id: string;
}

export default function ProjectPageComponent(): JSX.Element {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />; // new
    const id = +useParams<ParamType>().id;
    const dispatch = useDispatch();
    const history = useHistory();

    const [showModal,setShowModal]=useState(false);
    const handleOnClose =()=> setShowModal(false);

    const [projectInstance, setProjectInstance] = useState<Project | null>(null);
    const [fechingProject, setFetchingProject] = useState(true);
    const [updatingProject, setUpdatingProject] = useState(false);
    const mounted = useRef(false);

    const taskNamePlugins = useSelector((state: CombinedState) => state.plugins.components.taskItem.name);
    const deletes = useSelector((state: CombinedState) => state.projects.activities.deletes);
    const taskDeletes = useSelector((state: CombinedState) => state.tasks.activities.deletes);
    const tasksActiveInferences = useSelector((state: CombinedState) => state.models.inferences);
    const tasks = useSelector((state: CombinedState) => state.tasks.current);
    const tasksCount = useSelector((state: CombinedState) => state.tasks.count);
    const tasksQuery = useSelector((state: CombinedState) => state.projects.tasksGettingQuery);
    const tasksFetching = useSelector((state: CombinedState) => state.tasks.fetching);
    const [visibility, setVisibility] = useState(defaultVisibility);

    const queryParams = new URLSearchParams(history.location.search);
    const updatedQuery = { ...tasksQuery };
    for (const key of Object.keys(updatedQuery)) {
        (updatedQuery as Indexable)[key] = queryParams.get(key) || null;
        if (key === 'page') {
            updatedQuery.page = updatedQuery.page ? +updatedQuery.page : 1;
        }
    }

    useEffect(() => {
        if (Number.isInteger(id)) {
            core.projects.get({ id })
                .then(([project]: Project[]) => {
                    if (project && mounted.current) {
                        dispatch(getProjectTasksAsync({ ...updatedQuery, projectId: id }));
                        setProjectInstance(project);
                    }
                }).catch((error: Error) => {
                    if (mounted.current) {
                        notification.error({
                            message: 'Could not receive the requested project from the server',
                            description: error.toString(),
                        });
                    }
                }).finally(() => {
                    if (mounted.current) {
                        setFetchingProject(false);
                    }
                });
        } else {
            notification.error({
                message: 'Could not receive the requested project from the server',
                description: `Requested project id "${id}" is not valid`,
            });
            setFetchingProject(false);
        }

        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        history.replace({
            search: updateHistoryFromQuery(tasksQuery),
        });
    }, [tasksQuery]);

    useEffect(() => {
        if (projectInstance && id in deletes && deletes[id]) {
            history.push('/projects');
        }
    }, [deletes]);

    if (fechingProject) {
        return <Spin indicator={antIcon} size='large' className='cvat-spinner' /> ; // new
    }

    if (!projectInstance) {
        return (
            <Result
                className='cvat-not-found'
                status='404'
                title='There was something wrong during getting the project'
                subTitle='Please, be sure, that information you tried to get exist and you are eligible to access it'
            />
        );
    }

    const subsets = Array.from(
        new Set<string>(tasks.map((task: Task) => task.subset)),
    );
    const content = tasksCount ? (
        <>
            {subsets.map((subset: string) => (
                <React.Fragment key={subset}>
                    {subset && <Title level={4}>{subset}</Title>}
                    {tasks
                        .filter((task) => task.projectId === projectInstance.id && task.subset === subset)
                        .map((task: Task) => (
                            <TaskItem
                                key={task.id}
                                deleted={task.id in taskDeletes ? taskDeletes[task.id] : false}
                                hidden={false}
                                activeInference={tasksActiveInferences[task.id] || null}
                                taskNamePlugins={taskNamePlugins}
                                cancelAutoAnnotation={() => {
                                    dispatch(cancelInferenceAsync(task.id));
                                }}
                                taskInstance={task}
                            />
                        ))}
                </React.Fragment>
            ))}
            <Row justify='center' align='middle'>
                <Col md={22} lg={18} xl={16} xxl={14}>
                    <Pagination
                        className='cvat-project-tasks-pagination'
                        onChange={(page: number) => {
                            dispatch(getProjectTasksAsync({
                                ...tasksQuery,
                                projectId: id,
                                page,
                            }));
                        }}
                        showSizeChanger={false}
                        total={tasksCount}
                        pageSize={10}
                        current={tasksQuery.page}
                        showQuickJumper
                    />
                </Col>
            </Row>
        </>
    ) : (
        <Empty description='No tasks found' />
    );

    function Modal({visible,onClose}) {


        if (!visible) return null;
        return(
            <div className='fixed backdrop-blur-sm inset-0 bg-black bg-opacity-60 flex flex-row  justify-start'>
                <div className='bg-white flex flex-col justify-start  w-[300px] rounded-tr-[30px] rounded-br-[30px] p-[10px]'>
                    <DalpLogo className='w-1/2 ml-4'/>
                    <div className=' ml-4'>
                            <div>
                                <Dropdown
                                    trigger={['click']}
                                    overlay={(
                                        <CvatDropdownMenuPaper>
                                            <Button
                                                type='primary'
                                                icon={<PlusOutlined />}
                                                className='cvat-create-task-button'
                                                onClick={() => history.push(`/tasks/create?projectId=${id}`)}
                                            >
                                                Create a new task
                                            </Button>
                                            <Button
                                                type='primary'
                                                icon={<span className='anticon'><MultiPlusIcon /></span>}
                                                className='cvat-create-multi-tasks-button'
                                                onClick={() => history.push(`/tasks/create?projectId=${id}&many=true`)}
                                            >
                                                Create multi tasks
                                            </Button>
                                        </CvatDropdownMenuPaper>
                                    )}
                                >
                                    <Button
                                        type='primary'
                                        style={{backgroundColor:'white',borderColor:'white'}}
                                        className='cvat-create-task-dropdown'
                                        icon={<CreateTask />}
                                    />
                                </Dropdown>

                            </div>

                            <hr className='mt-8 mb-8'/>
                            <div className='-ml-[20px]'>
                                <SortingComponent
                                    visible={visibility.sorting}
                                    onVisibleChange={(visible: boolean) => (
                                        setVisibility({ ...defaultVisibility, sorting: visible })
                                    )}
                                    defaultFields={tasksQuery.sort?.split(',') || ['-ID']}
                                    sortingFields={['ID', 'Owner', 'Status', 'Assignee', 'Updated date', 'Subset', 'Mode', 'Dimension', 'Name']}
                                    onApplySorting={(sorting: string | null) => {
                                        dispatch(getProjectTasksAsync({
                                            ...tasksQuery,
                                            page: 1,
                                            projectId: id,
                                            sort: sorting,
                                        }));
                                    }}
                                />

                            </div>

                            <hr className='mt-8 mb-8'/>

                            <FilteringComponent
                                    value={updatedQuery.filter}
                                    predefinedVisible={visibility.predefined}
                                    builderVisible={visibility.builder}
                                    recentVisible={visibility.recent}
                                    onPredefinedVisibleChange={(visible: boolean) => (
                                        setVisibility({ ...defaultVisibility, predefined: visible })
                                    )}
                                    onBuilderVisibleChange={(visible: boolean) => (
                                        setVisibility({ ...defaultVisibility, builder: visible })
                                    )}
                                    onRecentVisibleChange={(visible: boolean) => (
                                        setVisibility({
                                            ...defaultVisibility,
                                            builder: visibility.builder,
                                            recent: visible,
                                        })
                                    )}
                                    onApplyFilter={(filter: string | null) => {
                                        dispatch(getProjectTasksAsync({
                                            ...tasksQuery,
                                            page: 1,
                                            projectId: id,
                                            filter,
                                        }));
                                    }}
                            />

                        </div>

                </div>
                <div className='w-4 h-4 ml-4 mt-8'>
                    <button type='button' onClick={onClose}>
                        <ModalCloseIcon/>
                    </button>
                </div>

            </div>
        )
     }

    let searchPhrase = '' ;

     const handleSearch = () => {
        //  onApplySearch(searchPhrase);
         dispatch(getProjectTasksAsync({
            ...tasksQuery,
            page: 1,
            projectId: id,
            search: searchPhrase,
        }));

     };

     const handleChange = (event:any) => {
        searchPhrase = event.target.value ;
     };


    //
    return (
        <Row justify='start' align='top' className={'cvat-project-page ' }>
             <Modal onClose={handleOnClose} visible={showModal}/>
             {showModal ? '' :

                <Row justify='space-between' align='middle' className='cvat-project-page-tasks-bar pl-8' >
                        <Col span={24}>

                            <button onClick={()=>setShowModal(true)} className='hover:scale:95 transition text-xl'>
                                <DalpListIcon/>
                            </button>
                            <div className='cvat-project-page-tasks-filters-wrapper'>
                                {/* <Input.Search
                                    enterButton
                                    onSearch={(_search: string) => {
                                        dispatch(getProjectTasksAsync({
                                            ...tasksQuery,
                                            page: 1,
                                            projectId: id,
                                            search: _search,
                                        }));
                                    }}
                                    defaultValue={tasksQuery.search || ''}
                                    className='cvat-project-page-tasks-search-bar ml-8'
                                    placeholder='Search ...'
                                /> */}
                                <TextField
                                    variant="outlined"
                                    placeholder="Search"
                                    defaultValue={tasksQuery.search || ''}
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                        <IconButton onClick={handleSearch}
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                        ),
                                        style: {
                                            height: '40px', // Set input height
                                            backgroundColor: 'white', // Set background color
                                            color: 'black', // Set text color
                                            width: '300px',
                                            borderRadius:'20px',
                                        },
                                    }}

                                />
                                <div>


                                </div>

                            </div>
                        </Col>
                </Row>
             }


            { updatingProject ? <CVATLoadingSpinner size='large' /> : null }
            { showModal ? '' :

                <Col
                    md={22}
                    lg={18}
                    xl={16}
                    xxl={14}
                    className='self-center'
                    style={updatingProject ? {
                        pointerEvents: 'none',
                        opacity: 0.7,
                    } : {}}
                >
                    <ProjectTopBar projectInstance={projectInstance} />
                    <DetailsComponent
                        onUpdateProject={(project: Project) => {
                            setUpdatingProject(true);
                            project.save().then((updatedProject: Project) => {
                                if (mounted.current) {
                                    dispatch(getProjectTasksAsync({ ...updatedQuery, projectId: id }));
                                    setProjectInstance(updatedProject);
                                }
                            }).catch((error: Error) => {
                                if (mounted.current) {
                                    notification.error({
                                        message: 'Could not update the project',
                                        description: error.toString(),
                                    });
                                }
                            }).finally(() => {
                                if (mounted.current) {
                                    setUpdatingProject(false);
                                }
                            });
                        }}
                        project={projectInstance}
                    />
                    <h3 style={{color:'rgba(17, 24, 39, 0.6)',fontFamily:'Lexend',marginTop:'10px',marginBottom:'15px'}}>Tasks</h3>

                    { tasksFetching ? (
                        <Spin indicator={antIcon} size='large' className='cvat-spinner' /> // new
                    ) : content }
                </Col>

            }

            <MoveTaskModal />
            <ModelRunnerDialog />
        </Row>
    );
}
