// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022-2023 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
import Icon, {
    SettingOutlined,
    InfoCircleOutlined,
    EditOutlined,
    LoadingOutlined,
    LogoutOutlined,
    GithubOutlined,
    QuestionCircleOutlined,
    CaretDownOutlined,
    ControlOutlined,
    UserOutlined,
    TeamOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import Layout from 'antd/lib/layout';
import Button from 'antd/lib/button';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Modal from 'antd/lib/modal';
import Text from 'antd/lib/typography/Text';
import Select from 'antd/lib/select';

import { getCore } from 'cvat-core-wrapper';
import config from 'config';

import { DalpLogoHeader1,DalpLogo1 } from 'icons';
import ChangePasswordDialog from 'components/change-password-modal/change-password-modal';
import CVATTooltip from 'components/common/cvat-tooltip';
import { switchSettingsDialog as switchSettingsDialogAction } from 'actions/settings-actions';
import { logoutAsync, authActions } from 'actions/auth-actions';
import { CombinedState } from 'reducers';
import { usePlugins } from 'utils/hooks';
import SettingsModal from './settings-modal/settings-modal';
import { Link } from 'react-router-dom';

const core = getCore();

interface Tool {
    name: string;
    description: string;
    server: {
        host: string;
        version: string;
    };
    core: {
        version: string;
    };
    canvas: {
        version: string;
    };
    ui: {
        version: string;
    };
}

interface StateToProps {
    user: any;
    userDetails : any
    tool: Tool;
    switchSettingsShortcut: string;
    settingsDialogShown: boolean;
    changePasswordDialogShown: boolean;
    changePasswordFetching: boolean;
    logoutFetching: boolean;
    renderChangePasswordItem: boolean;
    isAnalyticsPluginActive: boolean;
    isModelsPluginActive: boolean;
    isGitPluginActive: boolean;
    organizationsFetching: boolean;
    organizationsList: any[];
    currentOrganization: any | null;
}

interface DispatchToProps {
    onLogout: () => void;
    switchSettingsDialog: (show: boolean) => void;
    switchChangePasswordDialog: (show: boolean) => void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        auth: {
            user,
            userDetails,
            fetching: logoutFetching,
            fetching: changePasswordFetching,
            showChangePasswordDialog: changePasswordDialogShown,
            allowChangePassword: renderChangePasswordItem,
        },
        plugins: { list },
        about: { server, packageVersion },
        shortcuts: { normalizedKeyMap },
        settings: { showDialog: settingsDialogShown },
        organizations: { fetching: organizationsFetching, current: currentOrganization, list: organizationsList },
    } = state;

    return {
        user,
        userDetails,
        tool: {
            name: server.name as string,
            description: server.description as string,
            server: {
                host: core.config.backendAPI.slice(0, -7),
                version: server.version as string,
            },
            canvas: {
                version: packageVersion.canvas,
            },
            core: {
                version: packageVersion.core,
            },
            ui: {
                version: packageVersion.ui,
            },
        },
        switchSettingsShortcut: normalizedKeyMap.SWITCH_SETTINGS,
        settingsDialogShown,
        changePasswordDialogShown,
        changePasswordFetching,
        logoutFetching,
        renderChangePasswordItem,
        isAnalyticsPluginActive: list.ANALYTICS,
        isModelsPluginActive: list.MODELS,
        isGitPluginActive: list.GIT_INTEGRATION,
        organizationsFetching,
        currentOrganization,
        organizationsList,
    };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        onLogout: (): void => dispatch(logoutAsync()),
        switchSettingsDialog: (show: boolean): void => dispatch(switchSettingsDialogAction(show)),
        switchChangePasswordDialog: (show: boolean): void => dispatch(authActions.switchChangePasswordDialog(show)),
    };
}

type Props = StateToProps & DispatchToProps;

function HeaderContainer(props: Props): JSX.Element {
    const {
        user,
        userDetails,
        tool,
        logoutFetching,
        changePasswordFetching,
        settingsDialogShown,
        switchSettingsShortcut,
        switchSettingsDialog,
        switchChangePasswordDialog,
        renderChangePasswordItem,
        isAnalyticsPluginActive,
        isModelsPluginActive,
        organizationsFetching,
        currentOrganization,
        organizationsList,
    } = props;

    const {
        CHANGELOG_URL, LICENSE_URL, GITTER_URL, GITHUB_URL, GUIDE_URL, DISCORD_URL,
    } = config;

    const history = useHistory();
    const location = useLocation();

    const showAboutModal = useCallback((): void => {
        Modal.info({
            title: `${tool.name}`,
            content: (
                <div style={{fontFamily:'Lexend'}}>
                    <p>{`${tool.description}`}</p>
                    <p>
                        <Text strong>Server version:</Text>
                        <Text type='secondary'>{` ${tool.server.version}`}</Text>
                    </p>
                    <p>
                        <Text strong>Core version:</Text>
                        <Text type='secondary'>{` ${tool.core.version}`}</Text>
                    </p>
                    <p>
                        <Text strong>Canvas version:</Text>
                        <Text type='secondary'>{` ${tool.canvas.version}`}</Text>
                    </p>
                    <p>
                        <Text strong>UI version:</Text>
                        <Text type='secondary'>{` ${tool.ui.version}`}</Text>
                    </p>
                    <Row justify='space-around'>
                        <Col>
                            <a href={CHANGELOG_URL} target='_blank' rel='noopener noreferrer'>
                                What&apos;s new?
                            </a>
                        </Col>
                        <Col>
                            <a href={LICENSE_URL} target='_blank' rel='noopener noreferrer'>
                                MIT License
                            </a>
                        </Col>
                        <Col>
                            <a href={GITTER_URL} target='_blank' rel='noopener noreferrer'>
                                Need help?
                            </a>
                        </Col>
                        <Col>
                            <a href={DISCORD_URL} target='_blank' rel='noopener noreferrer'>
                                Find us on Discord
                            </a>
                        </Col>
                    </Row>
                </div>
            ),
            width: 800,
            okButtonProps: {
                style: {
                    width: '100px',
                },
            },
        });
    }, [tool]);

    const closeSettings = useCallback(() => {
        switchSettingsDialog(false);
    }, []);

    const resetOrganization = (): void => {
        localStorage.removeItem('currentOrganization');
        if (/(webhooks)|(\d+)/.test(window.location.pathname)) {
            window.location.pathname = '/';
        } else {
            window.location.reload();
        }
    };

    const setNewOrganization = (organization: any): void => {
        if (!currentOrganization || currentOrganization.slug !== organization.slug) {
            localStorage.setItem('currentOrganization', organization.slug);
            if (/\d+/.test(window.location.pathname)) {
                // a resource is opened (task/job/etc.)
                window.location.pathname = '/';
            } else {
                window.location.reload();
            }
        }
    };

    const plugins = usePlugins((state: CombinedState) => state.plugins.components.header.userMenu.items, props);

    const menuItems: [JSX.Element, number][] = [];
    if (user.isStaff) {
        menuItems.push([(
            <Menu.Item
                icon={<ControlOutlined />}
                style={{fontFamily:'Lexend'}}
                key='admin_page'
                onClick={(): void => {
                    window.open(`${tool.server.host}/admin`, '_blank');
                }}
            >
                Admin page
            </Menu.Item>
        ), 0]);
    }


    menuItems.push([(
        <Menu.SubMenu
            disabled={organizationsFetching}
            key='organization'
            style={{fontFamily:'Lexend'}}
            title='Organization'
            icon={organizationsFetching ? <LoadingOutlined /> : <TeamOutlined />}
        >
            {currentOrganization ? (
                <Menu.Item icon={<SettingOutlined />} key='open_organization' onClick={() => history.push('/organization')} className='cvat-header-menu-open-organization'>
                    Settings
                </Menu.Item>
            ) : null}
            <Menu.Item icon={<PlusOutlined />} key='create_organization' onClick={() => history.push('/organizations/create')} className='cvat-header-menu-create-organization'>Create</Menu.Item>
            { organizationsList.length > 5 ? (
                <Menu.Item
                    key='switch_organization'
                    style={{fontFamily:'Lexend'}}
                    onClick={() => {
                        Modal.confirm({
                            title: 'Select an organization',
                            okButtonProps: {
                                style: { display: 'none' },
                            },
                            content: (
                                <Select
                                    showSearch
                                    className='cvat-modal-organization-selector'
                                    value={currentOrganization?.slug}
                                    onChange={(value: string) => {
                                        if (value === '$personal') {
                                            resetOrganization();
                                            return;
                                        }

                                        const [organization] = organizationsList
                                            .filter((_organization): boolean => _organization.slug === value);
                                        if (organization) {
                                            setNewOrganization(organization);
                                        }
                                    }}
                                >
                                    <Select.Option value='$personal'>Personal workspace</Select.Option>
                                    {organizationsList.map((organization: any): JSX.Element => {
                                        const { slug } = organization;
                                        return <Select.Option key={slug} value={slug}>{slug}</Select.Option>;
                                    })}
                                </Select>
                            ),
                        });
                    }}
                >
                    Switch organization
                </Menu.Item>
            ) : (
                <>
                    <Menu.Divider />
                    <Menu.ItemGroup>
                        <Menu.Item
                            className={!currentOrganization ?
                                'cvat-header-menu-active-organization-item' : 'cvat-header-menu-organization-item'}
                            key='$personal'
                            onClick={resetOrganization}
                            style={{fontFamily:'Lexend'}}
                        >
                            Personal workspace
                        </Menu.Item>
                        {organizationsList.map((organization: any): JSX.Element => (
                            <Menu.Item
                                className={currentOrganization?.slug === organization.slug ?
                                    'cvat-header-menu-active-organization-item' : 'cvat-header-menu-organization-item'}
                                key={organization.slug}
                                style={{fontFamily:'Lexend'}}
                                onClick={() => setNewOrganization(organization)}
                            >
                                {organization.slug}
                            </Menu.Item>
                        ))}
                    </Menu.ItemGroup>
                </>
            )}
        </Menu.SubMenu>
    ), 10]);

    menuItems.push([(
        <Menu.Item
            icon={<SettingOutlined />}
            key='settings'
            title={`Press ${switchSettingsShortcut} to switch`}
            onClick={() => switchSettingsDialog(true)}
        >
            Settings
        </Menu.Item>
    ), 20]);

    menuItems.push([(
        <Menu.Item icon={<InfoCircleOutlined />} key='about' onClick={() => showAboutModal()}>
            About
        </Menu.Item>
    ), 30]);

    menuItems.push([(
        <Menu.Item
            key='profile-setup'
            icon={<UserOutlined /> }
            onClick={() => {
                history.push('/auth/profile');
            }}

        >
            Profile Setup
        </Menu.Item>
    ), 35]);


    if (renderChangePasswordItem) {
        menuItems.push([(
            <Menu.Item
                key='change_password'
                icon={changePasswordFetching ? <LoadingOutlined /> : <EditOutlined />}
                className='cvat-header-menu-change-password'
                onClick={(): void => switchChangePasswordDialog(true)}
                disabled={changePasswordFetching}
            >
                Change password
            </Menu.Item>
        ), 40]);
    }

    menuItems.push([(
        <Menu.Item
            key='logout'
            icon={logoutFetching ? <LoadingOutlined /> : <LogoutOutlined />}
            onClick={() => {
                history.push('/auth/logout');
            }}
            disabled={logoutFetching}
        >
            Logout
        </Menu.Item>
    ), 50]);


    menuItems.push(
        ...plugins.map(({ component: Component, weight }, index) => (
            [<Component key={index} targetProps={props} />, weight] as [JSX.Element, number]
        )),
    );

    const userMenu = (
        <Menu className='cvat-header-menu'>
            { menuItems.sort((menuItem1, menuItem2) => menuItem1[1] - menuItem2[1])
                .map((menuItem) => menuItem[0]) }
        </Menu>
    );

    const getButtonClassName = (value: string): string => {
        // eslint-disable-next-line security/detect-non-literal-regexp
        const regex = new RegExp(`${value}$`);
        const baseClass = `cvat-header-${value}-button cvat-header-button`;
        return location.pathname.match(regex) ?
            `${baseClass} cvat-active-header-button` : baseClass;
    };
    // new
    const pathName = window.location.pathname;
    const path1 = document.getElementById('projects-header');
    const path2 = document.getElementById('tasks-header');
    const path3 = document.getElementById('jobs-header');
    const path4 = document.getElementById('cloud-header');
    const path5 = document.getElementById('user-log');


    if(pathName.includes('projects') && path1!=null)  path1.style.color= '#111827'
    else { if(path1!=null) path1.style.color= 'rgba(17, 24, 39, 0.6)' }

    if(pathName.includes('tasks') && path2!=null)  path2.style.color= '#111827'
    else { if(path2!=null) path2.style.color= 'rgba(17, 24, 39, 0.6)' }

    if(pathName.includes('jobs') && path3!=null)  path3.style.color= '#111827'
    else { if(path3!=null) path3.style.color= 'rgba(17, 24, 39, 0.6)' }

    if(pathName.includes('cloudstorages') && path4!=null)  path4.style.color= '#111827'
    else { if(path4!=null) path4.style.color= 'rgba(17, 24, 39, 0.6)' }

    if(pathName.includes('auth/logs') && path5!=null)  path5.style.color= '#111827'
    else { if(path5!=null) path5.style.color= 'rgba(17, 24, 39, 0.6)' }

    const getProfilePercentage = ()=>{
        if(!userDetails) return 0;

        let totalInputs = 0;
        let filledInputs = 0;
        if(userDetails)
            for (let key in userDetails) {
                let value = userDetails[key];
                totalInputs++;
                if(value)   filledInputs++;
            }
        return Math.floor((filledInputs / totalInputs) ) ;
    }
    const profilePercentage = getProfilePercentage();

    return (
         <Layout.Header className='cvat-header' style={{height:'70px',fontFamily:'Lexend'}}>

            <div className='cvat-left-header ml-8 '>
                <button onClick={(event)=>{
                    event.preventDefault();
                    history.push('/projects');
                    }}>
                    <Icon className='cvat-logo-icon header-icon mr-24' component={DalpLogoHeader1} />
                </button>
            </div>
            <div className='cvat-right-header '>
                { profilePercentage === 1 && (
                <>
                    <div>
                        { userDetails.category!=='ANNOTATOR' &&

                            <Button
                                className={getButtonClassName('projects')}
                                style={{fontWeight:'bold',color:'rgba(17, 24, 39, 0.6)'}}
                                type='link'
                                onClick={(event: React.MouseEvent): void => {
                                    event.preventDefault();
                                    console.log(window.location.pathname);
                                    history.push('/projects');
                                }}
                                id='projects-header'
                            >
                                Projects
                            </Button>
                        }
                        { userDetails.category!=='ANNOTATOR' &&

                            <Button
                                className={getButtonClassName('tasks')}
                                style={{fontWeight:'bold',marginLeft:'30px',color:'rgba(17, 24, 39, 0.6)'}}
                                type='link'
                                value='tasks'
                                href='/tasks?page=1'
                                onClick={(event: React.MouseEvent): void => {
                                    event.preventDefault();
                                    history.push('/tasks');
                                }}
                                id='tasks-header'
                            >
                                Tasks
                            </Button>
                        }
                        <Button
                            className={getButtonClassName('jobs')}
                            style={{fontWeight:'bold',marginLeft:'30px',color:'rgba(17, 24, 39, 0.6)'}}
                            type='link'
                            value='jobs'
                            href='/jobs?page=1'
                            onClick={(event: React.MouseEvent): void => {
                                event.preventDefault();
                                history.push('/jobs');
                            }}
                            id='jobs-header'
                        >
                            Jobs
                        </Button>
                        <Button
                            className={getButtonClassName('cloudstorages')}
                            style={{fontWeight:'bold',marginLeft:'30px',color:'rgba(17, 24, 39, 0.6)'}}
                            type='link'
                            value='cloudstorages'
                            href='/cloudstorages?page=1'
                            onClick={(event: React.MouseEvent): void => {
                                event.preventDefault();
                                history.push('/cloudstorages');
                            }}
                            id='cloud-header'
                        >
                            Cloud Storages
                        </Button>
                        <Button
                            className={getButtonClassName('cloudstorages')}
                            style={{fontWeight:'bold',marginLeft:'30px',color:'rgba(17, 24, 39, 0.6)'}}
                            type='link'
                            value='userlogs'
                            href='/auth/logs'
                            onClick={(event: React.MouseEvent): void => {
                                event.preventDefault();
                                history.push('/auth/logs');
                            }}
                            id='user-log'
                        >
                            User log
                        </Button>
                        {isModelsPluginActive && false ? (
                            <Button
                                className={getButtonClassName('models')}
                                type='link'
                                value='models'
                                href='/models'
                                onClick={(event: React.MouseEvent): void => {
                                    event.preventDefault();
                                    history.push('/models');
                                }}
                            >
                                Models
                            </Button>
                        ) : null}
                        {isAnalyticsPluginActive && user.isSuperuser ? (
                            <Button
                                className={getButtonClassName('analytics')}
                                type='link'
                                href={`${tool.server.host}/analytics`}
                                onClick={(event: React.MouseEvent): void => {
                                    event.preventDefault();
                                    // false positive
                                    // eslint-disable-next-line
                                    window.open(`${tool.server.host}/analytics`, '_blank');
                                }}
                            >
                                Analytics
                            </Button>
                        ) : null}
                    </div>
                </>
                )}



                <CVATTooltip overlay='Click to open repository'>
                    <Button
                        icon={<DalpLogo1 />}
                        size='large'
                        className='cvat-open-repository-button cvat-header-button'
                        style={{marginRight:'42px',marginTop:'22px'}}
                        type='link'
                        href={'https://dalp.ai/'}
                        onClick={(event: React.MouseEvent): void => {
                            event.preventDefault();
                            // false alarm
                            // eslint-disable-next-line security/detect-non-literal-fs-filename
                            window.open('https://dalp.ai/', '_blank');
                        }}
                    />
                </CVATTooltip >

                <CVATTooltip overlay='Click to open repository'>
                    <Button
                        icon={<GithubOutlined />}
                        size='large'
                        className='cvat-open-repository-button cvat-header-button'
                        type='link'
                        href={GITHUB_URL}
                        onClick={(event: React.MouseEvent): void => {
                            event.preventDefault();
                            window.open(GITHUB_URL, '_blank');
                        }}
                    />
                </CVATTooltip>
                <CVATTooltip overlay='Click to open guide'>
                    <Button
                        icon={<QuestionCircleOutlined />}
                        size='large'
                        className='cvat-open-guide-button cvat-header-button'
                        type='link'
                        href={GUIDE_URL}
                        onClick={(event: React.MouseEvent): void => {
                            event.preventDefault();
                            window.open(GUIDE_URL, '_blank');
                        }}
                    />
                </CVATTooltip>
                <Dropdown placement='bottomRight' overlay={userMenu} className='cvat-header-menu-user-dropdown'>
                    <span>
                        <UserOutlined className='cvat-header-dropdown-icon' />
                        <Row>
                            <Col span={24}>
                                <Text strong className='cvat-header-menu-user-dropdown-user'>
                                    {user.username.length > 14 ? `${user.username.slice(0, 10)} ...` : user.username}
                                </Text>
                            </Col>
                            { currentOrganization ? (
                                <Col span={24}>
                                    <Text className='cvat-header-menu-user-dropdown-organization'>
                                        {currentOrganization.slug}
                                    </Text>
                                </Col>
                            ) : null }
                        </Row>
                        <CaretDownOutlined className='cvat-header-dropdown-icon' />
                    </span>
                </Dropdown>
            </div>
            <SettingsModal visible={settingsDialogShown} onClose={closeSettings} />
            {renderChangePasswordItem && <ChangePasswordDialog onClose={() => switchChangePasswordDialog(false)} />}

        </Layout.Header>
    );
}

function propsAreTheSame(prevProps: Props, nextProps: Props): boolean {
    let equal = true;
    for (const prop in nextProps) {
        if (prop in prevProps && (prevProps as any)[prop] !== (nextProps as any)[prop]) {
            if (prop !== 'tool') {
                equal = false;
            }
        }
    }

    return equal;
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(HeaderContainer, propsAreTheSame));
