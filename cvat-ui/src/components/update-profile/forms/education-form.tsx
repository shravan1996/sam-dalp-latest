import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select'

import InputWrapper from "../styles/InputWrapper";
import "../styles/styles.css"


export default function EducationForm(props: any): JSX.Element {
    const { user, userDetails, educationOptions, setSection, onUpdateProfile } = props;

    const iv = {
        education: userDetails ? userDetails.education : "",
    }

    const vs = Yup.object().shape({
        education: Yup.string()
        .required('Education is required'),
    });

    const os =  (values : any) => {
        try {
            const data = {
                education: values.education
            }

            onUpdateProfile(data);
            setSection(5);
        } catch (error) {
            console.log('unexpected error: ' + error);
            throw error;
        }
    }

    const styleSelect2 = {
        control: (already: any, state:any) => ({
            ...already,
            // marginTop: "-10px",
            cursor: 'text',
            width: '25rem',
            height: '2.5rem',
            boxShadow: "black !important",
            outline: "black !important",
            border: (state.isTouched | state.isFocused) ? "2px solid black !important " : "1px solid grey",
            backgroundColor: "white",
            "&:hover": {
                border: state.isFocused ? "1px solid black !impoirtant" : "1px solid grey ",
                backgroundColor: state.isFocused ? "#f3f5fd" : "white"
            }
        }),
        placeholder: (already: any,) => ({
            ...already,
            fontWeight: 'normal',
            fontSize: '1rem',
            color: '#9ca6b6',
            padding: '2%',
            // transform: 'scaleY(1.25)',
            // justifyContent: 'center'
        }),
        singleValue: (already: any) => ({
            ...already,
            color: "black",
            fontSize: '1rem'
        }),
        menuList: (already: any, state:any) => ({
            ...already,
            color: "black",
            fontSize: '15px',
            border: "1px solid #black ",
            backgroundColor: state.isFocused ? "#f3f5fd" : "white"
        }),
        option: (already: any, state:any) => ({
            ...already,
            color: "black",
            padding: '2%',
            border: "1px solid #black ",
            backgroundColor: state.isSelected ? "#f3f5fd" : "white",
            "&:hover": {
                backgroundColor: state.isFocused ? "#f3f5fd" : "white"
            }
        }),
        dropdownIndicator: (already: any, state:any) => ({
            ...already,
            cursor: 'pointer',
            // transform: 'scaleY(1.25)',
            color: "grey",
            "svg": {
                fill: "grey"
            },
            "svg:hover": {
                fill: "grey"
            },
            "&:hover": {
                color: state.isFocused ? "grey" : "grey"
            }
        })
    };

    return <>
        <Formik
            initialValues={iv}
            onSubmit={os}
            validationSchema={vs}
        >
            <Form>
                <div className='title-form'>
                    <div>EDUCAITON</div>
                    <h2>Please select your education level</h2>
                </div>

                <div className="form-row">
                    <InputWrapper style={{ display:'flex',flexDirection:'column' }}>
                        <Field
                            name="education"
                            className="form-field big-field"
                            placeholder="Education"
                        >
                            {(props:any) => {
                                const { field, form } = props
                                return (
                                    <Select
                                        value={educationOptions ? educationOptions.find(option => option.value === field.value) : ''}
                                        options={educationOptions}
                                        isSearchable
                                        styles={styleSelect2}
                                        id='education'
                                        name="education"
                                        placeholder="Your highest level of education"
                                        onChange={(option) => {
                                            option ? form.setFieldValue(field.name, option.value) :
                                                form.setFieldValue(field.name, "")
                                        }}
                                        onBlur={field.onBlur(field.name)}
                                    />
                                )
                            }}
                        </Field>
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="education" component="div" />
                        </div>
                    </InputWrapper>
                </div>
                <div className="form-actions">
                <button type="button" className='back-button-form' onClick={() => setSection(3)}>Back</button>
                    {/* <button type="submit" id="save-btn" className='save-button-form'>Save</button> */}
                    <button type="submit" id="next-btn" className='next-button-form' >Next</button>
                </div>
            </Form>
        </Formik>
    </>

}