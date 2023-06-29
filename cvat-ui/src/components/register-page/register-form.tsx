// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import Icon from '@ant-design/icons';
import Form, { RuleRender, RuleObject } from 'antd/lib/form';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import { Link } from 'react-router-dom';
import  {BackArrowIcon}  from 'icons';
import Text from 'antd/lib/typography/Text';
import patterns from 'utils/validation-patterns';
import Title from 'antd/lib/typography/Title';
import { UserAgreement } from 'reducers';
import { Row, Col } from 'antd/lib/grid';
import CVATSigningInput, { CVATInputType } from 'components/signing-common/cvat-signing-input';
import SignUpImage from '../../assets/signup-image.svg'; // importing signup image from assets
import DalpLogo from '../../assets/cvat-logo.svg'  // importing dalp logo
import BackIcon from '../../assets/back-icon.svg'; // importing bak icon
import {Select} from 'antd'; // importing select


export interface UserConfirmation {
    name: string;
    value: boolean;
}

export interface RegisterData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    category:string;
    password: string;
    confirmations: UserConfirmation[];
}

interface Props {
    fetching: boolean;
    userAgreements: UserAgreement[];
    onSubmit(registerData: RegisterData): void;
}

function validateUsername(_: RuleObject, value: string): Promise<void> {
    if (!patterns.validateUsernameLength.pattern.test(value)) {
        return Promise.reject(new Error(patterns.validateUsernameLength.message));
    }

    if (!patterns.validateUsernameCharacters.pattern.test(value)) {
        return Promise.reject(new Error(patterns.validateUsernameCharacters.message));
    }

    return Promise.resolve();
}

export const validatePassword: RuleRender = (): RuleObject => ({
    validator(_: RuleObject, value: string): Promise<void> {
        if (!patterns.validatePasswordLength.pattern.test(value)) {
            return Promise.reject(new Error(patterns.validatePasswordLength.message));
        }

        if (!patterns.passwordContainsNumericCharacters.pattern.test(value)) {
            return Promise.reject(new Error(patterns.passwordContainsNumericCharacters.message));
        }

        if (!patterns.passwordContainsUpperCaseCharacter.pattern.test(value)) {
            return Promise.reject(new Error(patterns.passwordContainsUpperCaseCharacter.message));
        }

        if (!patterns.passwordContainsLowerCaseCharacter.pattern.test(value)) {
            return Promise.reject(new Error(patterns.passwordContainsLowerCaseCharacter.message));
        }

        return Promise.resolve();
    },
});

export const validateConfirmation: ((firstFieldName: string) => RuleRender) = (
    firstFieldName: string,
): RuleRender => ({ getFieldValue }): RuleObject => ({
    validator(_: RuleObject, value: string): Promise<void> {
        if (value && value !== getFieldValue(firstFieldName)) {
            return Promise.reject(new Error('Two passwords that you enter is inconsistent!'));
        }

        return Promise.resolve();
    },
});

const validateAgreement: ((userAgreements: UserAgreement[]) => RuleRender) = (
    userAgreements: UserAgreement[],
): RuleRender => () => ({
    validator(rule: any, value: boolean): Promise<void> {
        const [, name] = rule.field.split(':');
        const [agreement] = userAgreements
            .filter((userAgreement: UserAgreement): boolean => userAgreement.name === name);
        if (agreement.required && !value) {
            return Promise.reject(new Error(`You must accept ${agreement.urlDisplayText} to continue!`));
        }

        return Promise.resolve();
    },
});

function RegisterFormComponent(props: Props): JSX.Element {
    const { fetching, onSubmit, userAgreements } = props;
    const [form] = Form.useForm();
    const [usernameEdited, setUsernameEdited] = useState(false);
    return (
        <div className='signin-page flex flex-row justify-start flex-wrap bg-white order-first'>


            <div className='signin-image pl-[15px] shadow-2xl shadow-[#6D88DF]    flex flex-col justify-start    rounded-tr-[30%]  '>
                <h1 className='text-4xl  services font-extrabold font-display  text-white mt-16 ml-16'>For High Accuracy<br/>Labelling</h1>
                <SignUpImage className='mb-[20px] mt-[0px]  login-picture' />
            </div>


            <div className={`cvat-register-form-wrapper ml-[64px]   ${userAgreements.length ? 'cvat-register-form-wrapper-extended' : ''}`}>
                {/* <Row justify='space-between' className='cvat-credentials-navigation mt-[20px] ml-[10px]'> */}

                {/* </Row> */}
                <Col className='flex flex-row justify-start mb-[20px] mt-[40px]'>
                    <div>
                        <Col style={{width:'50px',height:'30px',marginRight:'40px',marginTop:'9px'}}>
                            <Link to='/auth/login' ><BackIcon /></Link>
                        </Col>

                    </div>
                    <div className='flex flex-row ml-[70px]'>
                        <Title level={2} className='font-bold inline h-[20px] flex flex-row justify-center'>Create an account with</Title>
                        <DalpLogo  className='inline w-40 h-[40px] ml-[10px]'/>

                    </div>


                </Col>
                <Form
                    form={form}
                    onFinish={(values: Record<string, string | boolean>) => {
                        const category = values['category'] as string ;
                        console.log('category : ',category); // new

                        const agreements = Object.keys(values)
                            .filter((key: string):boolean => key.startsWith('agreement:'));
                        const confirmations = agreements
                            .map((key: string): UserConfirmation => ({ name: key.split(':')[1], value: (values[key] as boolean) }));
                        const values1 = { // added values1 instead of values
                            ...values, category
                        }

                        const rest = Object.entries(values)
                        .filter((entry: (string | boolean)[]) => !agreements.includes(entry[0] as string));
                            console.log('values1: ', values1);
                        onSubmit({
                            ...(Object.fromEntries(rest) as any as RegisterData),
                            confirmations,
                        });
                    }}
                    className='cvat-register-form'
                >
                    <Row gutter={8}>
                        <Col span={12} >
                            <Form.Item
                                className='cvat-credentials-form-item  w-2/4 h-[40px]'
                                style={{padding:'0 8px 0 8px',width:'230px',fontSize:'6px'}}
                                name='firstName'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please specify a first name',
                                        pattern: patterns.validateName.pattern,
                                    },
                                ]}
                            >
                                <CVATSigningInput

                                    id='firstName'
                                    placeholder='First name'
                                    autoComplete='given-name'
                                    onReset={() => form.setFieldsValue({ firstName: '' })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                className='cvat-credentials-form-item w-2/4 h-[40px] '
                                style={{padding:'0 8px 0 8px',width:'230px',marginLeft:'85px'}}
                                name='lastName'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please specify a last name',
                                        pattern: patterns.validateName.pattern,
                                    },
                                ]}
                            >
                                <CVATSigningInput
                                    id='lastName'
                                    placeholder='Last name'
                                    autoComplete='family-name'
                                    onReset={() => form.setFieldsValue({ lastName: '' })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        className='cvat-credentials-form-item w-3/4 h-[40px]  '
                        style={{padding:'0 8px 0 8px'}}
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
                            id='email'
                            autoComplete='email'
                            placeholder='Email'
                            onReset={() => form.setFieldsValue({ email: '', username: '' })}
                            onChange={(event) => {
                                const { value } = event.target;
                                if (!usernameEdited) {
                                    const [username] = value.split('@');
                                    form.setFieldsValue({ username });
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        className='cvat-credentials-form-item  w-3/4 h-[40px] '
                        style={{padding:'0 8px 0 8px',marginTop:'40px'}}
                        name='username'
                        rules={[
                            {
                                required: true,
                                message: 'Please specify a username',
                            },
                            {
                                validator: validateUsername,
                            },
                        ]}
                    >
                        <CVATSigningInput
                            id='username'
                            placeholder='Username'
                            autoComplete='username'
                            onReset={() => form.setFieldsValue({ username: '' })}
                            onChange={() => setUsernameEdited(true)}
                        />
                    </Form.Item>
                    <Form.Item
                        className='cvat-credentials-form-item cvat-register-form-last-field  w-3/4 h-[40px]  '
                        style={{padding:'0 8px 0 8px',marginTop:'40px'}}
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            }, validatePassword,
                        ]}

                    >
                        <CVATSigningInput
                            type={CVATInputType.PASSWORD}
                            id='password1'
                            placeholder='Password'
                            autoComplete='new-password'
                        />
                    </Form.Item>

                    <Form.Item
                        className='cvat-credentials-form-item h-[50px] '
                        style={{ padding: '0 8px 0 8px', marginTop: '40px' }}
                        name='category'
                        rules={[
                            {
                                required: true,
                                message: 'Please specify a category',
                            },
                        ]}
                    >
                        <div className='rounded-lg pb-[3px] border-2 h-[55px]  w-[99%]  text-[45px] font-[400] leading-8 text-[#c5bfbf]'>
                            <Select placeholder='Select a category' size={'large'} bordered={false} style={{ width: '98%',  height:'40px'}}>
                                <Select.Option value='Project-Co-ordinator'>Project Co-ordinator</Select.Option>
                                <Select.Option value='Annotator'>Annotator</Select.Option>
                            </Select>
                        </div>
                    </Form.Item>


                    {userAgreements.map((userAgreement: UserAgreement): JSX.Element => (
                        <Form.Item
                            className='cvat-agreements-form-item'
                            name={`agreement:${userAgreement.name}`}
                            key={userAgreement.name}
                            initialValue={false}
                            valuePropName='checked'
                            rules={[
                                {
                                    required: true,
                                    message: 'You must accept to continue!',
                                }, validateAgreement(userAgreements),
                            ]}
                        >
                            <Checkbox>
                                {userAgreement.textPrefix}
                                {!!userAgreement.url && (
                                    <a rel='noopener noreferrer' target='_blank' href={userAgreement.url}>
                                        {` ${userAgreement.urlDisplayText}`}
                                    </a>
                                )}
                            </Checkbox>
                        </Form.Item>
                    ))}

                    {
                        true && (
                            <Row>
                                <Col className='cvat-credentials-link ml-[159px] mb-[20px]   '>
                                    <input type='checkbox'/>
                                    <Text strong style={{color:'rgba(17, 24, 39, 0.6)',marginLeft:'10px'}} >
                                        By creating an account? I agree to the &nbsp;
                                        <Link to='' style={{color:'#7E96EA'}} className='underline '>data privacy disclosure</Link>
                                    </Text>
                                </Col>
                            </Row>
                        )
                    }

                    <Form.Item className='mt-[15px] rounded-xl ml-[45px] h-[80px] '>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='cvat-credentials-action-button'
                            loading={fetching}
                            disabled={fetching}
                        >
                            Create account
                        </Button>
                    </Form.Item>
                    {
                            true && (
                                <Row>
                                    <Col className='cvat-credentials-link ml-[250px] mb-[40px]   '>
                                        <Text strong style={{color:'rgba(17, 24, 39, 0.6)'}} >
                                            Already have an account? &nbsp;
                                            <Link to='/auth/login' style={{color:'#111827'}} className='underline text-[#111827]'>Login here</Link>
                                        </Text>
                                    </Col>
                                </Row>
                            )
                        }
                </Form>
            </div>

        </div>




    );
}

export default React.memo(RegisterFormComponent);
