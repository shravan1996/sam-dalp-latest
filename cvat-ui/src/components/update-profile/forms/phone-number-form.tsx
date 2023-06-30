import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select'
import "react-datepicker/dist/react-datepicker.css";

import InputWrapper from "../styles/InputWrapper";
import "../styles/styles.css"

export default function PhoneNumberForm(props: any): JSX.Element {
    const { user, userDetails, setSection, onUpdateProfile } = props;

    const iv = {
        mobileNumber: userDetails ? userDetails.mobile_number : "",
    }

    const vs = Yup.object().shape({
        mobileNumber: Yup.string()
            .matches(/^[6-9]\d{9}$/, 'Mobile number should have exactly 10 digits and start with 7, 8, or 9')
            .test('len', 'Mobile number should have exactly 10 digits', (val) => val?.length === 10)
            .required('Mobile number is required'),
    });

    const os = (values : any) => {
        try {
            const data = {
                mobile_number: values.mobileNumber
            }
            onUpdateProfile(data);
            setSection(7);
        } catch (error) {
            console.log('unexpected error: ' + error);
            throw error;
        }
    }

    return <>
        <Formik
            initialValues={iv}
            onSubmit={os}
            validationSchema={vs}
            >
            <Form>
                <div className='title-form'>
                    <div>PHONE NUMBER</div>
                    <h2>Please enter your Phone Number</h2>
                </div>

                <div className="form-row">
                    <InputWrapper style={{ display:'flex',flexDirection:'column' }}>
                        <Field
                            width={50}
                            id="mobileNumber"
                            name="mobileNumber"
                            placeholder="+91 | Phone Number"
                            className="form-field big-field"
                        />
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="mobileNumber" component="div" />
                        </div>
                    </InputWrapper>
                </div>

                <div className="form-actions">
                    <button type="button" className='back-button-form' onClick={() => setSection(5)}>Back</button>
                    {/* <button type="submit" id="save-btn" className='save-button-form'>Save</button> */}
                    <button type="submit" className='next-button-form' >Preview</button>
                </div>
            </Form>
        </Formik>
    </>

}