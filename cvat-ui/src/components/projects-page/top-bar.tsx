// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { Row, Col } from 'antd/lib/grid';
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Input from 'antd/lib/input';
import { PlusOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { importActions } from 'actions/import-actions';
import { usePrevious } from 'utils/hooks';
import { ProjectsQuery } from 'reducers';
import { SortingComponent, ResourceFilterHOC, defaultVisibility } from 'components/resource-sorting-filtering';

import {
    localStorageRecentKeyword, localStorageRecentCapacity, predefinedFilterValues, config,
} from './projects-filter-configuration';
import DalpListIcon from '../../assets/dalp-list-icon.svg';

import  ModalCloseIcon  from '../../assets/modal-close-icon.svg'; // importing x icon.
import DalpLogo from '../../assets/cvat-logo.svg'  // impoting dalp logo

import CreateProject from '../../assets/create-project.svg';
import CreateProject2 from '../../assets/create-project2.svg';
import Feedback from '../feedback/feedback';


const FilteringComponent = ResourceFilterHOC(
    config, localStorageRecentKeyword, localStorageRecentCapacity, predefinedFilterValues,
);

interface Props {
    onApplyFilter(filter: string | null): void;
    onApplySorting(sorting: string | null): void;
    onApplySearch(search: string | null): void;
    query: ProjectsQuery;
    importing: boolean;
    func:any;
}



function TopBarComponent(props: Props): JSX.Element {
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
    const prevImporting = usePrevious(importing);

    useEffect(() => {
        if (prevImporting && !importing) {
            onApplyFilter(query.filter);
        }
    }, [importing]);
    const history = useHistory();

    function Modal({visible,onClose}) {
        const [visibility, setVisibility] = useState(defaultVisibility);
        const [project,setProject] = useState(false); // to show and hide the pop ups in modal

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

            console.log('You are inside changingHide1', hide);
        }

        if (!visible) return null;
        return(
            <div className="fixed backdrop-blur-sm inset-0 bg-black bg-opacity-60 flex flex-row  font-['Lexend'] justify-start">
                <div className="overflow-y-visible bg-white flex flex-col justify-start  w-[300px] rounded-tr-[30px] rounded-br-[30px] p-[10px]">
                    <DalpLogo className='w-1/2 ml-4'/>
                    <div className=' ml-4'>
                            <div>
                                {/* <Dropdown
                                    trigger={['click']}
                                    overlay={


                                        <div className='cvat-projects-page-control-buttons-wrapper '>
                                            <Button
                                                id='cvat-create-project-button'
                                                className='cvat-create-project-button'
                                                type='primary'
                                                onClick={(): void => history.push('/projects/create')}
                                                icon={<PlusOutlined />}
                                            >
                                                Create a new project
                                            </Button>
                                            <Button
                                                className='cvat-import-project-button'
                                                type='primary'
                                                disabled={importing}
                                                icon={<UploadOutlined />}
                                                onClick={() => dispatch(importActions.openImportBackupModal('project'))}
                                            >
                                                Create from backup
                                                {importing && <LoadingOutlined className='cvat-import-project-button-loading' />}
                                            </Button>
                                        </div>
                                    }

                                >

                                    <CreateProject/>
                                </Dropdown> */}
                            </div>
                            <div className='mt-4'>
                                <button onClick={()=>{
                                    setProject(!project);
                                    changingHide1()
                                    console.log(project);
                                }}>
                                    {(project && hide.one) ? <CreateProject2/> : <CreateProject/>}

                                </button>
                                {(project && hide.one) &&
                                    <div className='cvat-projects-page-control-buttons-wrapper ' style={{marginLeft:'0px',marginTop:'12px'}}>
                                        <button
                                            id='cvat-create-project-button'
                                            className='cvat-create-project-button '
                                            // type='primary'
                                            style={{fontFamily:'Lexend',width:'150px',color:'#111827',borderWidth:'0px',fontWeight:'200'}}
                                            onClick={(): void => history.push('/projects/create')}

                                        >
                                            Create a new project
                                        </button>
                                        <button
                                            className='cvat-import-project-button'
                                            // type='primary'
                                            disabled={importing}
                                            style={{fontFamily:'Lexend',width:'150px',backgroundColor:'#ffffff',color:'#111827',borderWidth:'0px',fontWeight:'200'}}
                                            onClick={() => dispatch(importActions.openImportBackupModal('project'))}
                                        >
                                            Create from backup
                                            {importing && <LoadingOutlined className='cvat-import-project-button-loading' />}
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
                                    sortingFields={['ID', 'Assignee', 'Owner', 'Status', 'Name', 'Updated date']}
                                    onApplySorting={onApplySorting}
                                    hide={hide}
                                    changeHide={changeHide}
                                />

                            </div>



                            <hr className='mt-8 mb-4 '/>

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



        <Row className='cvat-projects-page-top-bar ml-[50px] mt-[10px]' justify='start' align='middle'>

            <Col md={22} lg={18} xl={16} xxl={16} >

                <Modal onClose={handleOnClose} visible={showModal}/>
                <button onClick={()=>{setShowModal(true); props.func(true)}} className='hover:scale:95 transition text-xl'>
                    <DalpListIcon/>
                </button>
                <div className={'cvat-projects-page-filters-wrapper ml-16'}>

                    {showModal ? '' :
                        <Input.Search
                            enterButton
                            onSearch={(phrase: string) => {
                                onApplySearch(phrase);
                            }}
                            defaultValue={query.search || ''}
                            className={'cvat-projects-page-search-bar' }
                            style={{fontFamily:'Lexend'}}
                            placeholder='Search '
                        />
                    }
                </div>
                <Feedback showModal={showModal}/>
            </Col>
        </Row>

    );
}

export default React.memo(TopBarComponent);
