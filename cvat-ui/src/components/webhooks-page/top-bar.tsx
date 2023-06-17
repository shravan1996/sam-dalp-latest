// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { Row, Col } from 'antd/lib/grid';
import { PlusOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';

import { SortingComponent, ResourceFilterHOC, defaultVisibility } from 'components/resource-sorting-filtering';
import { WebhooksQuery } from 'reducers';
import {
    localStorageRecentKeyword, localStorageRecentCapacity, config,
} from './webhooks-filter-configuration';

import  ModalCloseIcon  from '../../assets/modal-close-icon.svg'; // importing x icon.
import DalpLogo from '../../assets/cvat-logo.svg'  // impoting dalp logo
import DalpListIcon from '../../assets/dalp-list-icon.svg';


const FilteringComponent = ResourceFilterHOC(
    config, localStorageRecentKeyword, localStorageRecentCapacity,
);

interface VisibleTopBarProps {
    onApplyFilter(filter: string | null): void;
    onApplySorting(sorting: string | null): void;
    onApplySearch(search: string | null): void;
    query: WebhooksQuery;
    onCreateWebhook(): void;
    goBackContent: JSX.Element;
    func:any;
}

export default function TopBarComponent(props: VisibleTopBarProps): JSX.Element {
    const {
        query, onApplyFilter, onApplySorting, onApplySearch, onCreateWebhook, goBackContent,
    } = props;
    const [visibility, setVisibility] = useState(defaultVisibility);

    const [showModal,setShowModal]=useState(false);

    const handleOnClose =()=>{
         setShowModal(false);
         props.func(false)
    }


    function Modal({visible,onClose}) {
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
            <div className='fixed backdrop-blur-sm inset-0 bg-black bg-opacity-60 flex flex-row  justify-start'>
                <div className='bg-white flex flex-col justify-start  w-[300px] rounded-tr-[30px] rounded-br-[30px] p-[10px]'>
                    <DalpLogo className='w-1/2 ml-4'/>
                        <div className=' ml-4'>
                            <div className='-ml-[20px]'>
                                <SortingComponent
                                    visible={visibility.sorting}
                                    onVisibleChange={(visible: boolean) => (
                                        setVisibility({ ...defaultVisibility, sorting: visible })
                                    )}
                                    defaultFields={query.sort?.split(',') || ['-ID']}
                                    sortingFields={['ID', 'Target URL', 'Owner', 'Description', 'Type', 'Updated date']}
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
                                    setVisibility({
                                        ...defaultVisibility,
                                        builder: visibility.builder,
                                        recent: visible,
                                    })
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
        <>

            <Row className='cvat-webhooks-page-top-bar  ml-[50px]' justify='start' align='middle'>
                <Col md={22} lg={18} xl={16} xxl={14}>
                    <Modal onClose={handleOnClose} visible={showModal}/>
                    <button onClick={()=>{setShowModal(true); props.func(true)}}  className='hover:scale:95 transition text-xl'>
                        <DalpListIcon/>
                    </button>
                    { showModal ? '' :
                        <>

                            <div className='cvat-webhooks-page-filters-wrapper ml-16'>

                                <Input.Search
                                    enterButton
                                    onSearch={(phrase: string) => {
                                        onApplySearch(phrase);
                                    }}
                                    defaultValue={query.search || ''}
                                    className='cvat-webhooks-page-search-bar'
                                    placeholder='Search ...'
                                />

                                <div>


                                </div>
                            </div>
                            <div className='cvat-webhooks-add-wrapper'>
                                <Button onClick={onCreateWebhook} type='primary' className='cvat-create-webhook' icon={<PlusOutlined />} />
                            </div>
                            <div className='ml-16'>
                                {goBackContent}
                            </div>

                        </>
                    }
                </Col>
            </Row>
        </>
    );
}
