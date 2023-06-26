import React from "react";
import { parseISO } from 'date-fns';
import './styles/styles.css';
import { useHistory } from 'react-router-dom';

interface UserProps {
    setSection:any;
    genders: any,
    priorExpOptions:any,
    languageOptions: any,
    englishProficiencyOptions: any,
    educationOptions: any,
    userDetails: any,
    onUpdateProfile : any,
}

function PreviewPage(props: UserProps): JSX.Element {
    const {
        userDetails,
        setSection,
        onUpdateProfile,
        genders,
        languageOptions,
        englishProficiencyOptions,
        educationOptions,
        priorExpOptions
    } = props;

    console.log("userDetails" , userDetails)


    const history = useHistory() ;


    // const handleSubmit = () => onUpdateProfile(userDetails);
    return (
        <div className="outer-container w-[1200px] ml-[70px]">
            <div className="preview-container">
                <div className="title-preview">
                    <div> Preview</div>
                    <h2> Please review your profile info</h2>
                </div>
                <section className="preview-section">
                    <div className="section-title">
                        <h1>BASIC INFORMATION</h1>
                        <button type="button" className="section-edit-btn" onClick={() => setSection(1)}>Edit</button>
                    </div>
                    <div className="section-row">
                        <div className="section-field">
                            <div className="section-field-label">First Name</div>
                            <div className="section-field-value">{userDetails.first_name}</div>
                        </div>
                        <div className="section-field">
                            <div className="section-field-label">Last Name</div>
                            <div className="section-field-value">{userDetails.last_name}</div>
                        </div><div className="section-field">
                            <div className="section-field-label">Primary Email</div>
                            <div className="section-field-value">{userDetails.email}</div>
                        </div>
                    </div>
                    <div className="section-row">
                        <div className="section-field">
                            <div className="section-field-label">Date of Birth</div>
                            <div className="section-field-value">{userDetails.dob ? parseISO(userDetails.dob).toISOString().split('T')[0] : ""}</div>
                        </div>
                        <div className="section-field">
                            <div className="section-field-label">Gender</div>
                            <div className="section-field-value">{
                                genders.find((option: any)=> option.value === userDetails.gender)?.label || ''
                            }</div>
                        </div>
                    </div>
                </section>

                {/* Language Section */}
                <section className="preview-section">
                    <div className="section-title">
                        <h1>LANGUAGE</h1>
                        <button type="button" className="section-edit-btn" onClick={() => setSection(2)}>Edit</button>
                    </div>
                    <div className="section-row">
                        <div className="section-field">
                            <div className="section-field-label">Your primary language</div>
                            <div className="section-field-value">{
                                languageOptions.find((option: any) => option.value === userDetails.primary_language)?.label || ''
                            }</div>
                        </div>
                        <div className="section-field">
                            <div className="section-field-label">Your proficiency level in english</div>
                            <div className="section-field-value">{
                                englishProficiencyOptions.find((option: any) => option.value === userDetails.english_proficiency)?.label || ''
                            }</div>
                        </div><div className="section-field">
                            <div className="section-field-label"></div>
                            <div className="section-field-value"></div>
                        </div>
                    </div>
                </section>
                <section className="preview-section">
                    <div className="section-title">
                        <h1>LOCATION</h1>
                        <button type="button" className="section-edit-btn" onClick={() => setSection(3)}>Edit</button>
                    </div>
                    <div className="section-row">
                        <div className="section-field">
                            <div className="section-field-label big-field">Address (line1)</div>
                            <div className="section-field-value big-field">{userDetails?.address ? userDetails.address?.split("||")[0] : ""}</div>
                        </div>
                    </div>
                    <div className="section-row">
                        <div className="section-field">
                            <div className="section-field-label big-field">Address (line2)</div>
                            <div className="section-field-value big-field">{userDetails?.address ? userDetails.address?.split("||")[1] : ""}</div>
                        </div>
                    </div>
                    <div className="section-row">
                        <div className="section-field">
                            <div className="section-field-label">City</div>
                            <div className="section-field-value">{userDetails.city}</div>
                        </div>
                        <div className="section-field">
                            <div className="section-field-label">District</div>
                            <div className="section-field-value">{userDetails.district}</div>
                        </div>
                        <div className="section-field">
                            <div className="section-field-label">State</div>
                            <div className="section-field-value">{userDetails.state}</div>
                        </div>
                    </div>
                    <div className="section-row">
                        <div className="section-field">
                            <div className="section-field-label">Zip Code</div>
                            <div className="section-field-value">{userDetails.zipcode}</div>
                        </div>
                    </div>
                </section>
                <section className="preview-section">
                    <div className="section-title">
                        <h1>EDUCATION</h1>
                        <button type="button" className="section-edit-btn" onClick={() => setSection(4)}>Edit</button>
                    </div>
                    <div className="section-row">
                        <div className="section-field">
                            <div className="section-field-label">Your highest level of education</div>
                            <div className="section-field-value">{
                                educationOptions.find((option: any) => option.value === userDetails.education)?.label || ''
                            }</div>
                        </div>
                    </div>
                </section>
                <section className="preview-section">
                    <div className="section-title">
                        <h1>PRIOR EXOERIENCE</h1>
                        <button type="button" className="section-edit-btn" onClick={() => setSection(5)}>Edit</button>
                    </div>
                    <div className="section-row">
                        <div className="section-field">
                            <div className="section-field-label">Your prior experience</div>
                            <div className="section-field-value">{ (userDetails.prior_experience?.length) ?
                                priorExpOptions.filter((key: string) => userDetails.prior_experience.includes(key.value))
                                .map((key) => { return ( <div className="section-field-value big-field"  key={key.value}>{key.label}</div> )})
                                : " "
                            }</div>
                        </div>
                    </div>
                </section>
                <section className="preview-section">
                    <div className="section-title">
                        <h1>PHONE NUMBER</h1>
                        <button type="button" className="section-edit-btn" onClick={() => setSection(6)}>Edit</button>
                    </div>
                    <div className="section-row">
                        <div className="section-field">
                            <div className="section-field-label">Your phone number</div>
                            <div className="section-field-value">+91-{userDetails.mobile_number}</div>
                        </div>
                    </div>
                </section>
                <section className="preview-action-btn">
                {/* <button type="button" onClick= {()=>{setSection(1)}} className="back-button-form">Back</button> */}
                <button type="submit" className="preview-submit-btn" onClick={() =>{alert('Updated Successfully!' ); history.push('/'); }} >Submit</button>
                </section>
            </div>
        </div>
    )
}

export default PreviewPage;