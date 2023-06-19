// Copyright (C) 2021-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
import Button from 'antd/lib/button';
import { PlusOutlined } from '@ant-design/icons';

import { CloudStoragesQuery } from 'reducers';
import Input from 'antd/lib/input';
import { SortingComponent, ResourceFilterHOC, defaultVisibility } from 'components/resource-sorting-filtering';

import {
    localStorageRecentKeyword, localStorageRecentCapacity,
    predefinedFilterValues, config,
} from './cloud-storages-filter-configuration';
import DalpListIcon from '../../assets/dalp-list-icon.svg';

import  ModalCloseIcon  from '../../assets/modal-close-icon.svg'; // importing x icon.
import DalpLogo from '../../assets/dalp-logo.svg'  // importing dalp logo

import CreateCloudStorage from '../../assets/create-cloud-storage.svg';
import CreateCloudStorage2 from '../../assets/create-cloud-storage2.svg';

const FilteringComponent = ResourceFilterHOC(
    config, localStorageRecentKeyword, localStorageRecentCapacity, predefinedFilterValues,
);

interface Props {
    onApplyFilter(filter: string | null): void;
    onApplySorting(sorting: string | null): void;
    onApplySearch(search: string | null): void;
    query: CloudStoragesQuery;
}

export default function StoragesTopBar(props: Props): JSX.Element {
    const [showModal,setShowModal]=useState(false);
    const handleOnClose =()=> setShowModal(false);
    const {
        query, onApplyFilter, onApplySorting, onApplySearch,
    } = props;
    const history = useHistory();
    const [visibility, setVisibility] = useState(defaultVisibility);

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
                                    {(project && hide.one) ? <CreateCloudStorage2/> : <CreateCloudStorage/>}

                                </button>
                                {(project && hide.one) &&
                                    <button
                                    style={{fontFamily:'Lexend',width:'200px',marginTop:'5px',color:'#111827',borderWidth:'0px',fontWeight:'200'}}
                                    onClick={(): void => history.push('/cloudstorages/create')}
                                    >
                                        Create a new cloud storage
                                    </button>

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
                                    sortingFields={['ID', 'Provider type', 'Updated date', 'Display name', 'Resource', 'Credentials type', 'Owner', 'Description']}
                                    onApplySorting={(sorting: string | null) => {
                                        onApplySorting(sorting);
                                    }}
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
                                onApplyFilter={(filter: string | null) => {
                                    onApplyFilter(filter);
                                }}
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
        <Row justify='start' align='middle' className='cvat-cloud-storages-list-top-bar  -ml-[215px]'>
            <Col span={24}>
            <Modal onClose={handleOnClose} visible={showModal}/>
                <button onClick={()=>setShowModal(true)} className='hover:scale:95 transition text-xl'>
                    <DalpListIcon/>
                </button>
                <div className='cvat-cloudstorages-page-filters-wrapper ml-16'>

                    {showModal ? '' :


                        <Input.Search
                            enterButton
                            onSearch={(phrase: string) => {
                                onApplySearch(phrase);
                            }}
                            defaultValue={query.search || ''}
                            className='cvat-cloudstorages-page-tasks-search-bar'
                            placeholder='Search ...'
                        />
                    }
                </div>
                {/*<Button
                    className='cvat-attach-cloud-storage-button'
                    type='primary'
                    onClick={(): void => history.push('/cloudstorages/create')}
                    icon={<PlusOutlined />}
                />*/}
            </Col>
        </Row>
    );
}
