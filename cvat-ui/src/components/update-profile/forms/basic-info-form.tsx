import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import Select from 'react-select'
import { parseISO } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

import InputWrapper from "../styles/InputWrapper";
import "../styles/styles.css"


export default function BasicInfoForm(props: any): JSX.Element {
    const { user, userDetails, genders, setSection, onUpdateProfile } = props;

    const iv = {
        firstName: userDetails?.first_name ? userDetails.first_name : user.firstName,
        lastName: userDetails?.last_name ? userDetails.last_name: user.lastName,
        email: userDetails?.email ? userDetails.email : user.email,
        gender: userDetails?.gender ? userDetails.gender : "",
        dob: userDetails?.dob ? parseISO(userDetails.dob) : "",

        // dob: userDetails?.dob ? userDetails.dob : null,
    };

    const vs = Yup.object().shape({
        firstName: Yup.string()
        .matches(/^[a-zA-Z]+$/, 'First name should only contain alphabets')
        .required('First name is required'),
        lastName: Yup.string()
        .matches(/^[a-zA-Z]+$/, 'Last name should only contain alphabets')
        .required('Last name is required'),
        email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
        dob: Yup.date()
        .min(new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000), 'Date of birth should be within the last 100 years')
        .required('Date of birth is required'),
        gender: Yup.string()
        .required('Gender is required'),
    });

    const os = (values : any) => {
        try {
            const data = {
                dob: values.dob.toISOString().split('T')[0],
                gender: values.gender,
            }

            onUpdateProfile(data);
            setSection(2);
        } catch (error) {
            console.log('unexpected error: ' + error);
            throw error;
        }
    }

    const styleSelect = {
        control: (already: any, state:any) => ({
            ...already,
            // marginTop: "-10px",
            cursor: 'text',
            width: '12rem',
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


    let totalInputs = 0;
    let filledInputs = 0;



    if(userDetails!==null){

          for (let key in userDetails) {
                let value = userDetails[key];
                totalInputs++;
                if(value)   filledInputs++;
          }

    }


    const percentage = (filledInputs / totalInputs) * 100 ;


    return <>
        <Formik
            initialValues={iv}
            onSubmit={os}
            validationSchema={vs}
        >
            <Form>
                <div className='title-form flex flex-row justify-between'>
                    <div>
                        <div>BASIC INFORMATION</div>
                        <h2>Please enter your basic details</h2>

                    </div>
                    <div>
                        {percentage===100 && <p style={{color:'#15f505',marginRight:'16px'}}>Completed</p>}

                    </div>
                </div>
                <div className="form-row">
                    <InputWrapper>
                        <Field
                            width={50}
                            id="name"
                            name="firstName"
                            readOnly
                            autoFocus
                            className="form-field pre-filled"
                            placeholder="First Name"
                        />
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="firstName" component="div" />
                        </div>
                    </InputWrapper>
                    <InputWrapper>
                        <Field
                            width={50}
                            id="name"
                            name="lastName"
                            readOnly
                            autoFocus
                            placeholder="Last Name"
                            className="form-field pre-filled"
                        />
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="lastName" component="div" />
                        </div>
                    </InputWrapper>
                </div>
                <div className="form-row">
                    <InputWrapper>
                        <Field
                            width={100}
                            id="email"
                            readOnly
                            autoFocus
                            name="email"
                            placeholder="Email"
                            className="form-field big-field pre-filled"
                        />
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="email" component="div" />
                        </div>
                    </InputWrapper>
                </div>
                <div className="form-row">
                    <InputWrapper>
                        <Field name="dob" >
                        {(props:any) => {
                                const { field, form } = props
                                const selectedDate = field.value
                                return (
                                <DatePicker

                                    selected={selectedDate}
                                    showYearDropdown
                                    showMonthDropdown
                                    yearDropdownItemNumber={100}
                                    minDate={new Date("1900-01-01")}
                                    maxDate={new Date()}
                                    dateFormat="dd-MM-yyyy"
                                    scrollableYearDropdown={true}
                                    className="form-field"
                                    placeholderText='Date of Birth'
                                    onChange={(date: Date) => {
                                        console.log(typeof date,  date)
                                        date ? form.setFieldValue(field.name, (date)) :  //please use value and not valuOf
                                            form.setFieldValue(field.name, null)
                                    }}

                                />
                                )
                            }}
                        </Field>

                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="dob" component="div" />
                        </div>
                    </InputWrapper>
                </div>
                <div className="form-row">
                    <InputWrapper style={{ display:'flex',flexDirection:'column' }}>
                        <Field name='gender' className="form-field">
                            {(props:any) => {
                                const { field, form } = props
                                return (
                                    <Select
                                        value={genders ? genders.find(option => option.value === field.value) : ''}
                                        options={genders}
                                        isSearchable
                                        styles={styleSelect}
                                        id='gender'
                                        placeholder="Gender"
                                        onChange={(option) => {
                                            option ? form.setFieldValue(field.name, option.value) :  //please use value and not valuOf
                                                form.setFieldValue(field.name, "")
                                        }}
                                        onBlur={field.onBlur(field.name)}
                                    />
                                )
                            }}
                        </Field>
                        <div style={{ color: 'red' }}>
                            <ErrorMessage name="gender" component="div" />
                        </div>
                    </InputWrapper>
                </div>
                <div className="form-actions">
                    {/* <button type="submit" id="save-btn" className='save-button-form'>Save</button> */}
                    <button type="submit" id="next-btn" className='next-button-form' >Next</button>
                </div>
            </Form>
        </Formik>
    </>;
}