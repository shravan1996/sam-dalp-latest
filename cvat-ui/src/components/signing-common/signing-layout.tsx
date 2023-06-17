// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import Layout from 'antd/lib/layout';
import { Col, Row } from 'antd/lib/grid';
import { CVATLogo } from 'icons';
import Icon from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';
import SVGSigningBackground from '../../assets/signing-background.svg';
import SignImage from '../../assets/signup-image.svg';

interface SignInLayoutComponentProps {
    children: JSX.Element | JSX.Element[];
}

interface Sizes {
    xs?: { span: number };
    sm?: { span: number };
    md?: { span: number };
    lg?: { span: number };
    xl?: { span: number };
    xxl?: { span: number };
}

interface FormSizes {
    wrapper: Sizes;
    form: Sizes;
}

export const formSizes: FormSizes = {
    wrapper: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 },
        xl: { span: 15 },
        xxl: { span: 12 },
    },
    form: {
        xs: { span: 14 },
        sm: { span: 14 },
        md: { span: 14 },
        lg: { span: 14 },
        xl: { span: 16 },
        xxl: { span: 16 },
    },
};

function SignInLayout(props: SignInLayoutComponentProps): JSX.Element {
    const { children } = props;
    console.log(children)
    const { Content, Header } = Layout;
    const titleSizes = {
        xs: { span: 0 },
        sm: { span: 0 },
        md: { span: 0 },
        lg: { span: 0 },
        xl: { span: 8 },
        xxl: { span: 10 },
    };
    const logoSizes = {
        xs: { span: 21 },
        sm: { span: 21 },
        md: { span: 21 },
        lg: { span: 21 },
        xl: { span: 21 },
        xxl: { span: 22 },
    };
    return (
        <Layout className='w-screen h-screen layout'>
            <SVGSigningBackground className='cvat-signing-background' />
            {/*<Header className='cvat-signing-header'>
                <Row justify='center' align='middle'>
                    <Col {...logoSizes}>
                        <Icon className='cvat-logo-icon' component={CVATLogo} />
                    </Col>
                </Row>
            </Header>
            <Layout className='cvat-signing-layout'>
                <Content>
                    <Row justify='center' align='middle' style={{ height: '100%' }}>
                        <Col {...titleSizes} className='cvat-signing-title'>
                            <Title>Open Data</Title>
                            <Title>Annotation Platform</Title>
                        </Col>
                        {children}
                    </Row>
                </Content>
            </Layout>*/}
            <Row className='ant-row ant-row-start'>
                <Col className='w-full -ml-40'>
                     {children}
                </Col>
            </Row>
        </Layout>
    );
}

export default SignInLayout;
