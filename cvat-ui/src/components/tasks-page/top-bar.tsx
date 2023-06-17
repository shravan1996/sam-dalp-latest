// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { Row, Col } from 'antd/lib/grid';
import Dropdown from 'antd/lib/dropdown';
import { PlusOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import { importActions } from 'actions/import-actions';
import { SortingComponent, ResourceFilterHOC, defaultVisibility } from 'components/resource-sorting-filtering';
import { TasksQuery } from 'reducers';
import { usePrevious } from 'utils/hooks';
import { MultiPlusIcon } from 'icons';
import CvatDropdownMenuPaper from 'components/common/cvat-dropdown-menu-paper';
import {
    localStorageRecentKeyword, localStorageRecentCapacity, predefinedFilterValues, config,
} from './tasks-filter-configuration';
import DalpListIcon from '../../assets/dalp-list-icon.svg';

import  ModalCloseIcon  from '../../assets/modal-close-icon.svg'; // importing x icon.
import DalpLogo from '../../assets/cvat-logo.svg'  // impoting dalp logo

import CreateTaskIcon from '../../assets/create-task.svg';
import CreateTaskIcon2 from '../../assets/create-task2.svg';


const FilteringComponent = ResourceFilterHOC(
    config, localStorageRecentKeyword, localStorageRecentCapacity, predefinedFilterValues,
);

interface VisibleTopBarProps {
    onApplyFilter(filter: string | null): void;
    onApplySorting(sorting: string | null): void;
    onApplySearch(search: string | null): void;
    query: TasksQuery;
    importing: boolean;
    func:any;
}

export default function TopBarComponent(props: VisibleTopBarProps): JSX.Element {
    const [showModal,setShowModal]=useState(false);




    const handleOnClose =()=>{
         setShowModal(false);
         props.func(false)
    }

    const dispatch = useDispatch();
    const {
        importing, query, onApplyFilter, onApplySorting, onApplySearch,
    } = props;
    const [visibility, setVisibility] = useState(defaultVisibility);
    const history = useHistory();
    const prevImporting = usePrevious(importing);

    useEffect(() => {
        if (prevImporting && !importing) {
            onApplyFilter(query.filter);
        }
    }, [importing]);


    function Modal({visible,onClose}) {
        const [visibility, setVisibility] = useState(defaultVisibility);

        const [project,setProject] = useState(false);

        const[hide,setHide]=useState({'one':false,'two':false,'three':false,'four':false})  // hiding other filters when one is opened

        function changeHide(givenValue:any){
            setHide(givenValue);
            console.log(hide);
        }

        function changeHide2(givenValue:any){
            setHide(givenValue);
            console.log(hide);
        }

        function changingHide1(){
            if(hide.one===true) {setHide({'one':false,'two':false,'three':false,'four':false})}
            else{setHide({'one':true,'two':false,'three':false,'four':false})}
            console.log(hide);
        }

        if (!visible) return null;
        return(
            <div className='fixed backdrop-blur-sm inset-0 bg-black bg-opacity-60 flex flex-row  justify-start'>
                <div className='bg-white flex flex-col justify-start  w-[300px] rounded-tr-[30px] rounded-br-[30px] p-[10px]'>
                    <DalpLogo className='w-1/2 ml-4'/>
                        <div className=' ml-4'>
                            <div>
                                <button onClick={()=>{
                                    setProject(currentValue=>!currentValue);
                                    changingHide1()
                                }}>
                                    {(project && hide.one) ? <CreateTaskIcon2/> : <CreateTaskIcon/>}

                                </button>
                                {(project && hide.one) &&
                                    <div className='flex flex-col' style={{marginTop:'12px'}}>
                                        <button
                                            className='cvat-create-task-button '
                                            style={{fontFamily:'Lexend',width:'150px',color:'#111827',borderWidth:'0px',fontWeight:'200',marginRight:'8px',paddingRight:'20px'}}
                                            onClick={(): void => history.push('/tasks/create')}
                                        >
                                            Create a new task
                                        </button>
                                        <button
                                            className='cvat-create-multi-tasks-button mt-[3px] '
                                            style={{fontFamily:'Lexend',width:'150px',color:'#111827',borderWidth:'0px',fontWeight:'200',paddingRight:'20px'}}
                                            onClick={(): void => history.push('/tasks/create?many=true')}
                                        >
                                            Create multi tasks
                                        </button>
                                        <button
                                            className='cvat-import-task-button mt-[3px] '
                                            style={{fontFamily:'Lexend',width:'150px',color:'#111827',borderWidth:'0px',fontWeight:'200',paddingRight:'9px'}}
                                            disabled={importing}
                                            onClick={() => dispatch(importActions.openImportBackupModal('task'))}
                                        >
                                            Create from backup
                                            {importing && <LoadingOutlined />}
                                        </button>

                                    </div>
                                }


                            </div>

                            <hr className='mt-8 mb-8'/>
                            <div className='-ml-[20px]'>
                                <SortingComponent
                                    visible={visibility.sorting}
                                    onVisibleChange={(visible: boolean) => (
                                        setVisibility({ ...defaultVisibility, sorting: visible })
                                    )}
                                    defaultFields={query.sort?.split(',') || ['-ID']}
                                    sortingFields={['ID', 'Owner', 'Status', 'Assignee', 'Updated date', 'Subset', 'Mode', 'Dimension', 'Project ID', 'Name', 'Project name']}
                                    onApplySorting={onApplySorting}
                                    hide={hide}
                                    changeHide={changeHide}
                                />
                            </div>

                            <hr className='mt-8 mb-8'/>

                            <FilteringComponent
                                value={query.filter}
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
                                    setVisibility({ ...defaultVisibility, builder: visibility.builder, recent: visible })
                                )}
                                onApplyFilter={onApplyFilter}
                                hide={hide}
                                changeHide2={changeHide2}
                            />



                        </div>

                </div>
                <div className='w-[8px] h-[8px] ml-4 mt-8'>
                    <button type='button' onClick={onClose}>
                        <ModalCloseIcon/>
                    </button>
                </div>

            </div>
        )
     }




    return (
        <Row className='cvat-tasks-page-top-bar ml-[50px]' justify='start' align='middle'>
            <Col md={22} lg={18} xl={16} xxl={14}>
                <Modal onClose={handleOnClose} visible={showModal}/>
                <button onClick={()=>{setShowModal(true); props.func(true)}}  className='hover:scale:95 transition text-xl'>
                    <DalpListIcon/>
                </button>

                <div className='cvat-tasks-page-filters-wrapper ml-16'>
                    {showModal ? '' :
                        <Input.Search
                            enterButton
                            onSearch={(phrase: string) => {
                                onApplySearch(phrase);
                            }}
                            defaultValue={query.search || ''}
                            className='cvat-tasks-page-search-bar'
                            placeholder='Search ...'
                        />
                    }


                </div>

            </Col>
        </Row>
    );
}
