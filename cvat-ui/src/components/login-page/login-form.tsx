// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022-2023 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import { Col, Row } from 'antd/lib/grid';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import Icon from '@ant-design/icons';
import {
    BackArrowIcon, ClearIcon,
} from 'icons';

import CVATSigningInput, { CVATInputType } from 'components/signing-common/cvat-signing-input';
import { CombinedState } from 'reducers';
import { usePlugins } from 'utils/hooks';
import DalpLogo from '../../assets/cvat-logo.svg'  // importing dalp logo
import LoginImage from '../../assets/login-image.svg'  // impoting login image
import BackIcon from '../../assets/back-icon.svg'; // importing bak icon

export interface LoginData {
    credential: string;
    password: string;
}

interface Props {
    renderResetPassword: boolean;
    fetching: boolean;
    onSubmit(loginData: LoginData): void;
}

function LoginFormComponent(props: Props): JSX.Element {
    const {
        fetching, onSubmit, renderResetPassword,
    } = props;
    const [form] = Form.useForm();
    const [credential, setCredential] = useState('');
    const pluginsToRender = usePlugins(
        (state: CombinedState) => state.plugins.components.loginPage.loginForm,
        props, { credential },
    );

    const forgotPasswordLink = (
        <Col className='cvat-credentials-link'>
            <Text strong>
                <Link to={credential.includes('@') ?
                    `/auth/password/reset?credential=${credential}` : '/auth/password/reset'}
                >
                    Forgot password?
                </Link>
            </Text>
        </Col>
    );

    return (
        <div className='login-page ml-[150px] flex flex-row flex-wrap bg-white  '>


        <div className='cvat-login-form-wrapper flex flex-col justify-start '>
            <Row justify='space-between' className='cvat-credentials-navigation'>
                {
                    false && (
                        <Col>
                            <Icon
                                component={BackArrowIcon}
                                onClick={() => {
                                    setCredential('');
                                    form.setFieldsValue({ credential: '' });
                                }}
                            />
                        </Col>
                         )
                        }
                        {/* {
                            !credential && (
                                <Row>
                                    <Col className='cvat-credentials-link'>
                                        <Text strong>
                                            Don't have an account?&nbsp;
                                            <Link to='/auth/register' className='underline text-blue-600'>Register here</Link>
                                        </Text>
                                    </Col>
                                </Row>
                            )
                        } */}
                        {/* {
                            renderResetPassword && forgotPasswordLink
                        } */}
                    </Row>
                    <Col className='flex flex-row justify-center'>
                        <Title level={2} className='font-bold inline h-[20px] flex flex-row justify-center'> Login to  </Title>
                        <DalpLogo  className='inline w-40 h-[40px] ml-[10px]'/>

                    </Col>
                    <Form
                        className={`cvat-login-form ${true ? 'cvat-login-form-extended' : ''}`}

                        form={form}
                        onFinish={(loginData: LoginData) => {
                            onSubmit(loginData);
                        }}
                    >
                        <Form.Item
                        className='cvat-credentials-form-item w-2/4'
                        style={{width:'500px',marginLeft:'180px'}}
                        name='credential'
                    >
                        <Input
                            autoComplete='credential'
                            prefix={<Text>Email or username</Text>}
                            className={credential ? 'cvat-input-floating-label-above' : 'cvat-input-floating-label'}
                            suffix={credential && (
                                <Icon
                                    component={ClearIcon}
                                    onClick={() => {
                                        setCredential('');
                                        form.setFieldsValue({ credential: '', password: '' });
                                    }}
                                />
                            )}
                            onChange={(event) => {
                                const { value } = event.target;
                                setCredential(value);
                                if (!value) form.setFieldsValue({ credential: '', password: '' });
                            }}
                        />
                    </Form.Item>
                    {
                        true && (
                            <Form.Item
                                className='cvat-credentials-form-item  w-2/4'
                                style={{width:'500px',marginLeft:'180px',marginTop:'30px'}}
                                name='password'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please specify a password',
                                    },
                                ]}
                            >
                            <CVATSigningInput
                                    type={CVATInputType.PASSWORD}
                                    id='password'
                                    placeholder='Password'
                                    autoComplete='password'
                                />
                            </Form.Item>
                        )
                    }
                    <Row className='ml-[185px] mt-[10px] mb-[30px] mr-[180px] flex flex-row justify-between'>

                        {
                       true && (
                                <Col className='flex flex-row'>
                                    <input type='checkbox'/>
                                    <Text className='ml-4 font-bold'>Remember me</Text>

                                </Col>

                        )
                        }
                        {
                            true && (

                            renderResetPassword && forgotPasswordLink

                            )
                        }
                    </Row>

                    {
                        true || !socialAuthentication ? (
                            <Form.Item>
                                <Button
                                    className='cvat-credentials-action-button mb-[40px] mr-[180px] '
                                    style={{width:'500px',marginLeft:'180px',marginTop:'15px'}}
                                    loading={fetching}
                                    disabled={false}
                                    htmlType='submit'
                                >
                                    Login
                                </Button>
                            </Form.Item>
                        ) : socialAuthentication
                    }

                    {
                        true && (
                            <Row>
                                <Col className='cvat-credentials-link ml-[300px] mb-[40px] mr-[100px]  '>
                                    <Text strong style={{color:'rgba(17, 24, 39, 0.6)'}}>
                                        Don't you have an account?&nbsp;
                                        <Link to='/auth/register' style={{color:'#111827'}} className='underline text-blue-600'>Register here</Link>
                                    </Text>
                                </Col>
                            </Row>
                        )
                    }
                </Form>
            </div>

            <div className='login-image pl-[15px] shadow-2xl shadow-[#6D88DF]   flex flex-col justify-start    rounded-tl-[30%]  '>
                <h1 className='text-4xl services  font-display font-extrabold text-white mt-16 ml-16'>Powering AI with Human<br/> Insight</h1>
                <LoginImage className='mb-[1px] login-picture' />
            </div>
        </div>
     );
}

export default React.memo(LoginFormComponent);
