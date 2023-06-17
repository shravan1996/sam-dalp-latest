// Copyright (C) 2022 Intel Corporation
// Copyright (C) 2022-2023 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect } from 'react';
import 'react-awesome-query-builder/lib/css/styles.css';
import AntdConfig from 'react-awesome-query-builder/lib/config/antd';
import {
    Builder, Config, ImmutableTree, Query, Utils as QbUtils,
} from 'react-awesome-query-builder';
import {
    DownOutlined, FilterFilled, FilterOutlined,
} from '@ant-design/icons';
import Dropdown from 'antd/lib/dropdown';
import Space from 'antd/lib/space';
import Button from 'antd/lib/button';
import  { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import { Checkbox } from 'antd'; // new
import Menu from 'antd/lib/menu';
import { useSelector } from 'react-redux';
import { CombinedState } from 'reducers';
import { User } from 'components/task-page/user-selector';
import QuickFilterIcon from '../../assets/quick-filters.svg';
import QuickFilterIcon2 from '../../assets/quick-filters2.svg';
import FilterIcon from '../../assets/filters.svg';
import FilterIcon2 from '../../assets/filters2.svg';

interface ResourceFilterProps {
    predefinedVisible?: boolean;
    recentVisible: boolean;
    builderVisible: boolean;
    value: string | null;
    disabled?: boolean;
    onPredefinedVisibleChange?: (visible: boolean) => void;
    onBuilderVisibleChange(visible: boolean): void;
    onRecentVisibleChange(visible: boolean): void;
    onApplyFilter(filter: string | null): void;
    hide: any;
    changeHide2:any
}

export default function ResourceFilterHOC(
    filtrationCfg: Partial<Config>,
    localStorageRecentKeyword: string,
    localStorageRecentCapacity: number,
    predefinedFilterValues?: Record<string, string>,
): React.FunctionComponent<ResourceFilterProps> {
    const config: Config = { ...AntdConfig, ...filtrationCfg };
    const defaultTree = QbUtils.checkTree(
        QbUtils.loadTree({ id: QbUtils.uuid(), type: 'group' }), config,
    ) as ImmutableTree;

    function keepFilterInLocalStorage(filter: string): void {
        if (typeof filter !== 'string') {
            return;
        }

        let savedItems: string[] = [];
        try {
            savedItems = JSON.parse(localStorage.getItem(localStorageRecentKeyword) || '[]');
            if (!Array.isArray(savedItems) || savedItems.some((item: any) => typeof item !== 'string')) {
                throw new Error('Wrong filters value stored');
            }
        } catch (_: any) {
            // nothing to do
        }
        savedItems.splice(0, 0, filter);
        savedItems = Array.from(new Set(savedItems)).slice(0, localStorageRecentCapacity);
        localStorage.setItem(localStorageRecentKeyword, JSON.stringify(savedItems));
    }

    function receiveRecentFilters(): Record<string, string> {
        let recentFilters: string[] = [];
        try {
            recentFilters = JSON.parse(localStorage.getItem(localStorageRecentKeyword) || '[]');
            if (!Array.isArray(recentFilters) || recentFilters.some((item: any) => typeof item !== 'string')) {
                throw new Error('Wrong filters value stored');
            }
        } catch (_: any) {
            // nothing to do
        }

        return recentFilters
            .reduce((acc: Record<string, string>, val: string) => ({ ...acc, [val]: val }), {});
    }

    const defaultAppliedFilter: {
        predefined: string[] | null;
        recent: string | null;
        built: string | null;
    } = {
        predefined: null,
        recent: null,
        built: null,
    };

    function isValidTree(tree: ImmutableTree): boolean {
        return (QbUtils.queryString(tree, config) || '').trim().length > 0 && QbUtils.isValidTree(tree);
    }

    function unite(filters: string[]): string {
        if (filters.length > 1) {
            return JSON.stringify({
                and: filters.map((filter: string): JSON => JSON.parse(filter)),
            });
        }

        return filters[0];
    }

    function getPredefinedFilters(user: User): Record<string, string> | null {
        let result: Record <string, string> | null = null;
        if (user && predefinedFilterValues) {
            result = {};
            for (const key of Object.keys(predefinedFilterValues)) {
                result[key] = predefinedFilterValues[key].replace('<username>', `${user.username}`);
            }
        }

        return result;
    }

    function ResourceFilterComponent(props: ResourceFilterProps): JSX.Element {
        const {
            predefinedVisible, builderVisible, recentVisible, value,
            onPredefinedVisibleChange, onBuilderVisibleChange, onRecentVisibleChange, onApplyFilter,hide,changeHide2,
            disabled,
        } = props;

        const user = useSelector((state: CombinedState) => state.auth.user);
        const [isMounted, setIsMounted] = useState<boolean>(false);
        const [recentFilters, setRecentFilters] = useState<Record<string, string>>({});
        const [appliedFilter, setAppliedFilter] = useState(defaultAppliedFilter);
        const [state, setState] = useState<ImmutableTree>(defaultTree);

        useEffect(() => {
            setRecentFilters(receiveRecentFilters());
            setIsMounted(true);

            try {
                if (value) {
                    const tree = QbUtils.loadFromJsonLogic(JSON.parse(value), config);
                    if (tree && isValidTree(tree)) {
                        setAppliedFilter({
                            ...appliedFilter,
                            built: JSON.stringify(QbUtils.jsonLogicFormat(tree, config).logic),
                        });
                        setState(tree);
                    }
                }
            } catch (_: any) {
                // nothing to do
            }
        }, []);

        useEffect(() => {
            const listener = (event: MouseEvent): void => {
                const path: HTMLElement[] = event.composedPath()
                    .filter((el: EventTarget) => el instanceof HTMLElement) as HTMLElement[];
                if (path.some((el: HTMLElement) => el.id === 'root') && !path.some((el: HTMLElement) => el.classList.contains('ant-btn'))) {
                    if (builderVisible) {
                        onBuilderVisibleChange(false);
                    }

                    if (predefinedVisible) {
                        onRecentVisibleChange(false);
                    }
                }
            };

            window.addEventListener('click', listener);
            return () => window.removeEventListener('click', listener);
        }, [builderVisible, predefinedVisible]);

        useEffect(() => {
            if (!isMounted) {
                // do not request resources until on mount hook is done
                return;
            }

            if (appliedFilter.predefined?.length) {
                onApplyFilter(unite(appliedFilter.predefined));
            } else if (appliedFilter.recent) {
                onApplyFilter(appliedFilter.recent);
                const tree = QbUtils.loadFromJsonLogic(JSON.parse(appliedFilter.recent), config);
                if (isValidTree(tree)) {
                    setState(tree);
                }
            } else if (appliedFilter.built) {
                if (value !== appliedFilter.built) {
                    onApplyFilter(appliedFilter.built);
                }
            } else {
                onApplyFilter(null);
                setState(defaultTree);
            }
        }, [appliedFilter]);

        const renderBuilder = (builderProps: any): JSX.Element => (
            <div className='query-builder-container'>
                <div className='query-builder qb-lite'>
                    <Builder {...builderProps} />
                </div>
            </div>
        );

        const [filter,setFilter]=useState(false); // new
        const [filter2,setFilter2]=useState(false); // new

        const predefinedFilters = getPredefinedFilters(user);

        function changingHide3(){
            if(hide.three===true) {changeHide2({'one':false,'two':false,'three':false,'four':false})}
            else{changeHide2({'one':false,'two':false,'three':true,'four':false})}

        }

        function changingHide4(){
            if(hide.four===true) {changeHide2({'one':false,'two':false,'three':false,'four':false})}
            else{changeHide2({'one':false,'two':false,'three':false,'four':true})}

        }


        return (
            <div className='cvat-resource-page-filters flex flex-col justify-start'>
                <Button
                    className='cvat-quick-filters-button mt-4 mb-4 '
                    style={{ borderColor:"white"}}
                    type='default'
                    onClick={() => {setFilter(currentValue => !currentValue);changingHide3()}}
                >
                     {((filter===true && hide.three )&& predefinedFilters) ? <QuickFilterIcon2/> : <QuickFilterIcon/> }

                    {/* { appliedFilter.predefined ?
                        <FilterFilled /> :
                        <FilterOutlined />} */}
                </Button>

                {((filter===true && hide.three )&& predefinedFilters) ?
                    <div className='cvat-resource-page-predefined-filters-list'>
                        {Object.keys(predefinedFilters).map((key: string): JSX.Element => (
                            <Checkbox
                                checked={appliedFilter.predefined?.includes(predefinedFilters[key])}
                                onChange={(event: CheckboxChangeEvent) => {
                                    console.log(`checked = ${event.target.checked}`);
                                    let updatedValue: string[] | null = appliedFilter.predefined || [];
                                    if (event.target.checked) {
                                        updatedValue.push(predefinedFilters[key]);
                                    } else {
                                        updatedValue = updatedValue
                                            .filter((appliedValue: string) => (
                                                appliedValue !== predefinedFilters[key]
                                            ));
                                    }

                                    if (!updatedValue.length) {
                                        updatedValue = null;
                                    }

                                    setAppliedFilter({
                                        ...defaultAppliedFilter,
                                        predefined: updatedValue,
                                    });
                                }}
                                key={key}
                            >
                                {key}
                            </Checkbox>
                        )) }
                    </div> : <p></p>

                }



                <hr className='mt-4 mb-8'  style={{ backgroundColor:"#374151",height:"1px",width:"250px"}} />

                <Button className='cvat-switch-filters-constructor-button' style={{ borderColor:"white"}}  type='default' onClick={() => {onBuilderVisibleChange(!builderVisible);setFilter2(currentVal =>!currentVal);changingHide4()}}>
                        {(filter2 && hide.four)? <FilterIcon2/> : <FilterIcon/>}

                        {/* { appliedFilter.built || appliedFilter.recent ?
                            <FilterFilled /> :
                            <FilterOutlined />} */}
                </Button>
                {(filter2 && hide.four) ?
                    <div className='cvat-resource-page-filters-builder'>
                        { Object.keys(recentFilters).length ? (
                            <Dropdown
                                placement='bottomRight'
                                visible={recentVisible}
                                destroyPopupOnHide
                                overlay={(
                                    <div className='cvat-resource-page-recent-filters-list'>
                                        <Menu selectable={false}>
                                            {Object.keys(recentFilters).map((key: string): JSX.Element | null => {
                                                const tree = QbUtils.loadFromJsonLogic(JSON.parse(key), config);

                                                if (!tree) {
                                                    return null;
                                                }

                                                return (
                                                    <Menu.Item
                                                        key={key}
                                                        onClick={() => {
                                                            if (appliedFilter.recent === key) {
                                                                setAppliedFilter(defaultAppliedFilter);
                                                            } else {
                                                                setAppliedFilter({
                                                                    ...defaultAppliedFilter,
                                                                    recent: key,
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        {QbUtils.queryString(tree, config)}
                                                    </Menu.Item>
                                                );
                                            })}
                                        </Menu>
                                    </div>
                                )}
                            >
                                <Button
                                    className='cvat-recent-filters-button'
                                    size='small'
                                    type='text'
                                    onClick={
                                        () => onRecentVisibleChange(!recentVisible)
                                    }
                                >
                                    Recent
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        ) : null}

                        <Query
                            {...config}
                            onChange={(tree: ImmutableTree) => {
                                setState(tree);
                            }}
                            value={state}
                            renderBuilder={renderBuilder}
                        />
                        <Space className='cvat-resource-page-filters-space'>
                            <Button
                                className='cvat-reset-filters-button'
                                style={{backgroundColor:'rgba(17, 24, 39, 0.05)',color:'rgba(17, 24, 39, 0.7)',borderRadius:'6px',border:'1px solid #374151',fontWeight:'bold'}}
                                disabled={!QbUtils.queryString(state, config)}
                                size='small'
                                onClick={() => {
                                    setState(defaultTree);
                                    setAppliedFilter({
                                        ...appliedFilter,
                                        recent: null,
                                        built: null,
                                    });
                                }}
                            >
                                Reset
                            </Button>
                            <Button
                                className='cvat-apply-filters-button'
                                style={{backgroundColor:'#7E96EA',color:'#FFFFFF',borderRadius:'5px',border:'1px solid rgba(55, 65, 81, 0.2)',fontWeight:'bold'}}
                                size='small'
                                type='primary'
                                onClick={() => {
                                    const filter = QbUtils.jsonLogicFormat(state, config).logic;
                                    const stringified = JSON.stringify(filter);
                                    keepFilterInLocalStorage(stringified);
                                    setRecentFilters(receiveRecentFilters());
                                    onBuilderVisibleChange(false);
                                    setAppliedFilter({
                                        predefined: null,
                                        recent: null,
                                        built: stringified,
                                    });
                                }}
                            >
                                Apply
                            </Button>
                        </Space>
                    </div>
                    : <p></p>
                }



                <hr className='mt-8 mb-4'  style={{ backgroundColor:"#374151",height:"1px",width:"250px"}} />


                <Button
                    className='cvat-clear-filters-button'
                    disabled={!(appliedFilter.built || appliedFilter.predefined || appliedFilter.recent) || disabled}
                    size='small'
                    type='link'
                    onClick={() => { setAppliedFilter({ ...defaultAppliedFilter }); }}
                >
                    Clear filters
                </Button>
            </div>
        );
    }

    return React.memo(ResourceFilterComponent);
}
