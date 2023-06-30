import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import * as Yup from 'yup';

import InputWrapper from "../styles/InputWrapper";
import "../styles/styles.css"


export default function ExperienceForm(props: any): JSX.Element {
    const { user, userDetails, priorExpOptions, setSection, onUpdateProfile } = props;

    const iv = {
        priorExperience: userDetails.prior_experience || ['none'],
      }

    const vs = Yup.object().shape({
        priorExperience: Yup.array().required('Prior Expeience Field is Requied'),
    });

    const os = (values : any) => {
        try {
            if (values.priorExperience.length === 0) {
                alert('Prior Experience Field Is Required');
                return ;
            }

            const data = {
                prior_experience: values.priorExperience,
            }

            onUpdateProfile(data);
            setSection(6);
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
        {(formikProps) => (
            <Form>
            <div className='title-form'>
                <div>PRIOR EXPERIENCE</div>
                <h2>Please share your previous experience</h2>
            </div>

            <div className="form-row">
                <InputWrapper>
                    <FormGroup>
                        {priorExpOptions.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            control={
                            <Checkbox
                                checked={formikProps.values.priorExperience.includes(option.value)}
                                onChange={(event) => {
                                    const isChecked = event.target.checked;
                                    const priorExperience = formikProps.values.priorExperience;
                                    let updatedPriorExperience;

                                    if (option.value === 'none') {
                                        // If "Option 3" is selected, unselect all other options
                                        updatedPriorExperience = isChecked ? [option.value] : [];
                                    } else {
                                        // If any other option is selected, unselect "Option 3" if it was previously selected
                                        updatedPriorExperience = isChecked
                                        ? priorExperience.includes('none')
                                            ? [option.value]
                                            : [...priorExperience, option.value]
                                        : priorExperience.filter((value) => value !== option.value);
                                    }

                                    formikProps.setFieldValue('priorExperience', updatedPriorExperience);
                                    }}
                            />
                            }
                            label={option.label}
                        />
                        ))}
                    </FormGroup>

                {/* <Field
                    width={50}
                    id="priorExperience"
                    name="priorExperience"
                    placeholder="Prior Experience"
                    className="form-field big-field"
                /> */}
                <div style={{ color: 'red' }}>
                    <ErrorMessage name="priorExperience" component="div" />
                </div>
                </InputWrapper>
            </div>
            <div className="form-actions">
                <button type="button" className='back-button-form' onClick={() => setSection(4)}>Back</button>
                {/* <button type="submit" id="save-btn" className='save-button-form'>Save</button> */}
                <button type="submit" id="next-btn" className='next-button-form' >Next</button>
            </div>
            </Form>
        )}
        </Formik>
    </>

}