// Copyright (C) 2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { Col, Row } from 'antd/lib/grid';
import Input from 'antd/lib/input';

import { JobsQuery } from 'reducers';
import { SortingComponent, ResourceFilterHOC, defaultVisibility } from 'components/resource-sorting-filtering';
import {
    localStorageRecentKeyword, localStorageRecentCapacity, predefinedFilterValues, config,
} from './jobs-filter-configuration';

import DalpListIcon from '../../assets/dalp-list-icon.svg';

import  ModalCloseIcon  from '../../assets/modal-close-icon.svg'; // importing x icon.
import DalpLogo from '../../assets/cvat-logo.svg'  // impoting dalp logo

const FilteringComponent = ResourceFilterHOC(
    config, localStorageRecentKeyword, localStorageRecentCapacity, predefinedFilterValues,
);

interface Props {
    query: JobsQuery;
    onApplyFilter(filter: string | null): void;
    onApplySorting(sorting: string | null): void;
    onApplySearch(search: string | null): void;
    func:any;
}

function TopBarComponent(props: Props): JSX.Element {
    const [showModal,setShowModal]=useState(false);

    const handleOnClose =()=> {
        setShowModal(false);
         props.func(false);
    }

    const {
        query, onApplyFilter, onApplySorting, onApplySearch,
    } = props;
    const [visibility, setVisibility] = useState(defaultVisibility);

    function Modal2({visible,onClose}) {
        const [visibility, setVisibility] = useState(defaultVisibility);

        const[hide,setHide]=useState({'one':false,'two':false,'three':false,'four':false})  // hiding other filters when one is opened

        function changeHide(givenValue:any){
            setHide(givenValue);
            console.log(hide);
        }

        function changeHide2(givenValue:any){
            setHide(givenValue);
            console.log(hide);
        }

        if (!visible) return null;
        return(
            <div className='fixed backdrop-blur-sm inset-0 bg-black bg-opacity-60 flex justify-start'>
                <div className='bg-white flex flex-col justify-start  w-[300px] h-full rounded-tr-[30px] rounded-br-[30px] p-[10px]'>
                    <DalpLogo className='w-1/2 ml-4'/>

                    <div className=' ml-4'>

                            <div className='-ml-[20px]'>
                                <SortingComponent
                                    visible={visibility.sorting}
                                    onVisibleChange={(visible: boolean) => (
                                        setVisibility({ ...defaultVisibility, sorting: visible })
                                    )}
                                    defaultFields={query.sort?.split(',') || ['-ID']}
                                    sortingFields={['ID', 'Assignee', 'Updated date', 'Stage', 'State', 'Task ID', 'Project ID', 'Task name', 'Project name']}
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
                <div className='w-[8px] h-[8px] self-start mt-8 mr-[1210px]'>

                    <button type='button' onClick={onClose}>
                        <ModalCloseIcon/>
                    </button>

                </div>
            </div>
        )
     }

    return (
        <Row className='cvat-jobs-page-top-bar ml-[50px] ' justify='start' align='middle'>
            <Col md={22} lg={18} xl={16} xxl={16}>
            <Modal2 onClose={handleOnClose} visible={showModal}/>
                <button onClick={()=>{setShowModal(true); props.func(true)}}  className='hover:scale:95 transition text-xl'>
                    <DalpListIcon/>
                </button>
                <div className='ml-16' >
                    {showModal ? '' :
                        <Input.Search
                            enterButton
                            onSearch={(phrase: string) => {
                                onApplySearch(phrase);
                            }}
                            defaultValue={query.search || ''}
                            className='cvat-jobs-page-search-bar'
                            placeholder='Search ...'
                        />
                        }
                </div>
            </Col>
        </Row>
    );
}

export default React.memo(TopBarComponent);
