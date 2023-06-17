// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corp
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Icon from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import { BackArrowIcon } from 'icons';
import { Col, Row } from 'antd/lib/grid';
import { Link, useLocation } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import CVATSigningInput from 'components/signing-common/cvat-signing-input';
import DalpLogo from '../../assets/cvat-logo.svg'  // impoting dalp logo
import LoginImage from '../../assets/login-image.svg'  // impoting login image


export interface ResetPasswordData {
    email: string;
}

interface Props {
    fetching: boolean;
    onSubmit(resetPasswordData: ResetPasswordData): void;
}

function ResetPasswordFormComponent({ fetching, onSubmit }: Props): JSX.Element {
    const [form] = Form.useForm();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const defaultCredential = params.get('credential');
    return (

        <div className='reset-password flex flex-row flex-wrap bg-white'>

            <div className='cvat-password-reset-form-wrapper  flex flex-col  justify-start '>
                <div className='reset-header  flex flex-col justify-end '>
                    <Row justify='space-between' className='cvat-credentials-navigation ml-[90px]'>
                        <Icon
                            component={() => <Link to='/auth/login'><BackArrowIcon /></Link>}
                        />
                    </Row>
                    <div className='self-center'>
                        <Row className='text-center'>
                            <Col>
                                <DalpLogo  className='w-40 h-[40px] ml-[80px]'/>
                            </Col>
                        </Row>


                        <Row className='text-center mt-[15px]'>
                            <Col>
                                <Title  level={2} className='font-bold'> Forgot your password? </Title>
                            </Col>
                        </Row>
                        <Row className='text-center mt-[5px]'>
                            <Col>
                                <Text >Enter your email address and we'll send you an <br/> instructions to reset your password</Text>
                            </Col>
                        </Row>
                    </div>

                </div>

                <Form
                    form={form}
                    className='cvat-password-reset-form '
                    initialValues={{
                        email: defaultCredential,
                    }}
                    onFinish={(resetPasswordData: ResetPasswordData) => {
                        onSubmit(resetPasswordData);
                    }}
                >
                    <Form.Item
                        className='cvat-credentials-form-item ml-[80px]'
                        name='email'
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please specify an email address',
                            },
                        ]}
                    >
                        <CVATSigningInput
                            autoComplete='email'
                            placeholder='Email address'
                            onReset={() => form.setFieldsValue({ email: '' })}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            className='cvat-credentials-action-button'
                            loading={fetching}
                            htmlType='submit'
                        >
                            Send
                        </Button>
                    </Form.Item>
                    {
                        true && (
                            <Row>
                                <Col className='cvat-credentials-link ml-[380px] mb-[40px] mr-[100px]  '>
                                    <Text strong >

                                        <Link to='/auth/login' className='underline text-blue-600'>Back to login</Link>
                                    </Text>
                                </Col>
                            </Row>
                        )
                    }
                    {
                        true && (
                            <Row>
                                <Col className='cvat-credentials-link ml-[300px] mb-[40px] mr-[100px]  '>
                                    <Text strong >
                                        Don't you have an account?&nbsp;
                                        <Link to='/auth/register' className='underline text-blue-600'>Register here</Link>
                                    </Text>
                                </Col>
                            </Row>
                        )
                    }
                </Form>
            </div>

            <div className='reset-image pl-[15px] shadow-2xl shadow-[#6D88DF]   flex flex-col justify-start rounded-tl-[30%]  '>
                <h1 className='text-4xl services  font-display font-extrabold text-white mt-16 ml-16'>We provide the best <br/>services.</h1>
                <LoginImage className='mb-[1px] login-picture' />

            </div>
        </div>


    );
}

export default React.memo(ResetPasswordFormComponent);
