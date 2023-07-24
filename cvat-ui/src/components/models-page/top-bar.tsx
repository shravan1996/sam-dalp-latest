// Copyright (C) 2022-2023 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { Row, Col } from 'antd/lib/grid';
import { PlusOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button';
import { Input } from 'antd';
import { SortingComponent, ResourceFilterHOC, defaultVisibility } from 'components/resource-sorting-filtering';
import { ModelsQuery } from 'reducers';
import {
    localStorageRecentKeyword, localStorageRecentCapacity, config,
} from './models-filter-configuration';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const FilteringComponent = ResourceFilterHOC(
    config, localStorageRecentKeyword, localStorageRecentCapacity,
);

interface VisibleTopBarProps {
    onApplyFilter(filter: string | null): void;
    onApplySorting(sorting: string | null): void;
    onApplySearch(search: string | null): void;
    query: ModelsQuery;
    onCreateModel(): void;
    disabled?: boolean;
}

export default function TopBarComponent(props: VisibleTopBarProps): JSX.Element {
    const {
        query, onApplyFilter, onApplySorting, onApplySearch, onCreateModel, disabled,
    } = props;
    const [visibility, setVisibility] = useState(defaultVisibility);

    let searchPhrase= '';

    const handleSearch = () => {
        onApplySearch(searchPhrase);
    };

    const handleChange = (event:any) => {
     searchPhrase= event.target.value ;
    };


    return (
        <Row className='cvat-models-page-top-bar' justify='center' align='middle'>
            <Col md={22} lg={18} xl={16} xxl={16}>
                <div className='cvat-models-page-filters-wrapper'>
                <>

                    {/* <Input.Search
                        enterButton

                        onSearch={(phrase: string) => {
                            onApplySearch(phrase);
                        }}
                        defaultValue={query.search || ''}
                        className='cvat-jobs-page-search-bar'
                        placeholder='Search ...'
                        style={{ borderRadius: '14px', backgroundColor: '#f7f7f7', border: 'none' }}
                    /> */}
                        <TextField
                            variant="outlined"
                            placeholder="Search"
                            defaultValue={query.search || ''}
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
                </>
                    <div>
                        <SortingComponent
                            disabled={disabled}
                            visible={visibility.sorting}
                            onVisibleChange={(visible: boolean) => (
                                setVisibility({ ...defaultVisibility, sorting: visible })
                            )}
                            defaultFields={query.sort?.split(',') || ['-ID']}
                            sortingFields={['ID', 'Target URL', 'Owner', 'Description', 'Type', 'Updated date']}
                            onApplySorting={onApplySorting}
                        />
                        <FilteringComponent
                            disabled={disabled}
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
                        />
                    </div>
                </div>
                <div className='cvat-models-add-wrapper'>
                    <Button onClick={onCreateModel} type='primary' className='cvat-create-model' icon={<PlusOutlined />} />
                </div>
            </Col>
        </Row>
    );
}
