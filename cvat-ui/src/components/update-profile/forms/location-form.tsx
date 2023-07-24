import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import InputWrapper from "../styles/InputWrapper";
import "../styles/styles.css"


export default function LocationForm(props: any): JSX.Element {
    const { user, userDetails, setSection, onUpdateProfile } = props;

    const iv = {
        address1: userDetails?.address ? userDetails.address?.split("||")[0] : "",
        address2: userDetails?.address ? userDetails.address?.split("||")[1] : "",
        city: userDetails?.city ? userDetails.city : "",
        district: userDetails?.district ? userDetails.district : "",
        state: userDetails?.state ? userDetails.state : "",
        zipcode: userDetails?.zipcode ? userDetails.zipcode : "",
    }

    const vs = Yup.object().shape({
        address1: Yup.string()
        .required('Address is required'),
        city: Yup.string()
        .required('City is required'),
        district: Yup.string()
        .required('District is required'),
        state: Yup.string()
        .required('State is required'),
        zipcode: Yup.string()
        .matches(/^[1-9]\d{5}$/, 'Zip Code must 6 digits.')
        .required('Zip code is required.'),
    });

    const os = (values : any) => {
        try {
            const address = values.address1 + "||" + values.address2;
            const data = {
                address: address,
                city: values.city,
                district: values.district,
                state: values.state,
                zipcode: values.zipcode
            }

            onUpdateProfile(data);
            setSection(4);
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
                    <div>LOCATION</div>
                    <h2>Please enter your complete address information</h2>
                </div>

                <div className="form-row">
                    <InputWrapper style={{ display:'flex',flexDirection:'column' }}>
                        <Field
                            width={50}
                            id="address1"
                            name="address1"
                            className="form-field big-field"
                            placeholder="Address Line 1"
                        />
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="address1" component="div" />
                        </div>
                    </InputWrapper>
                </div>
                <div className="form-row">
                    <InputWrapper style={{ display:'flex',flexDirection:'column' }}>
                        <Field
                            width={100}
                            id="address2"
                            name="address2"
                            placeholder="Address Line 2"
                            className="form-field big-field"
                        />
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="address2" component="div" />
                        </div>
                    </InputWrapper>
                </div>
                <div className="form-row">
                    <InputWrapper style={{ display:'flex',flexDirection:'column' }}>
                        <Field
                            width={50}
                            id="city"
                            name="city"
                            placeholder="City"
                            className="form-field"
                        />
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="city" component="div" />
                        </div>
                    </InputWrapper>
                    <InputWrapper style={{ display:'flex',flexDirection:'column' }}>
                        <Field
                            width={50}
                            id="district"
                            name="district"
                            placeholder="District"
                            className="form-field"
                        />
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="district" component="div" />
                        </div>
                    </InputWrapper>
                </div>
                <div className="form-row">
                    <InputWrapper style={{ display:'flex',flexDirection:'column' }}>
                        <Field
                            width={50}
                            id="state"
                            name="state"
                            placeholder="State"
                            className="form-field"
                        />
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="state" component="div" />
                        </div>
                    </InputWrapper>
                    <InputWrapper style={{ display:'flex',flexDirection:'column' }}>
                        <Field
                            width={50}
                            id="zipcode"
                            name="zipcode"
                            placeholder="Zip Code"
                            className="form-field"
                        />
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="zipcode" component="div" />
                        </div>
                    </InputWrapper>
                </div>

                <div className="form-actions">
                    <button type="button" className='back-button-form' onClick={() => setSection(2)}>Back</button>
                    {/* <button type="submit" id="save-btn" className='save-button-form'>Save</button> */}
                    <button type="submit" id="next-btn" className='next-button-form' >Next</button>
                </div>
            </Form>
        </Formik>
    </>

}