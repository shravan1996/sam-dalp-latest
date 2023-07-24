import React, { useState } from 'react';
import { getCore } from 'cvat-core-wrapper';
import { useHistory } from 'react-router';

import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PhoneIcon from '@mui/icons-material/Phone';


import PreviewPage from './preview-page';
import BasicInfoForm from './forms/basic-info-form';
import LanguageForm from './forms/language-form';
import LocationForm from './forms/location-form';
import EducationForm from './forms/education-form';
import ExperienceForm from './forms/experience-form';
import PhoneNumberForm from './forms/phone-number-form';
import Wrapper from "./styles/Wrapper";
import "./styles/styles.css";
import "./styles.scss";
import {Link} from 'react-router-dom';
import {SettingOutlined} from '@ant-design/icons';
import AnnotatorProfileComponent from './annotator-profile-page/annotator-profile-page';
import ProfileSettingsComponent from './profile-settings/profile-settings';
import { SettingsActionTypes } from 'actions/settings-actions';

const cvat = getCore();

export default function UpdateProfileForm(props: any): JSX.Element {
    console.log(props) ;
    const [toggle, setToggle] = useState(false);
    const [profileSettings, setProfile] = useState(false)

    const changeToggle=(value2: any)=>{
        setToggle(value2)
    }

    const changeProfile=(value: any) =>{
        setProfile(value);
    }

    const {
        user,
        userDetails,
        fetching,
        hasEmailVerificationBeenSent,
        onUpdateProfile,

    } = props;

    console.log(userDetails);


    const history = useHistory();

    const [section, setSection] = useState(1);

    const genders = [
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' },
        { value: 'O', label: 'Other' }
    ];
    const languageOptions = [
        { value: 'Telugu', label: 'Telugu' },
        { value: 'Hindi', label: 'Hindi' },
        { value: 'Tamil', label: 'Tamil' },
        { value: 'Kannada', label: 'Kannada' },
        { value: 'Marathi', label: 'Marathi' },
        { value: 'Other', label: 'Other Language' }
    ];
    const englishProficiencyOptions = [
        { value: 'basic', label: 'Basic Skills' },
        { value: 'good', label: 'Good Command' },
        { value: 'v_good', label: 'Very Good Command' },
        { value: 'ex', label: 'Excellent Command' },
        { value: 'fluent', label: 'Fluent' },
        { value: 'native', label: 'Native Speaker' }
    ];
    const educationOptions = [
        { value: '10th', label: '10th Standard' },
        { value: '12th', label: '12th Standard' },
        { value: 'bachelor', label: "Bachelor's Degree" },
        { value: 'master', label: "Master's Degree" }
    ];
    const priorExpOptions = [
        { value: 'image', label: 'I have prior experience in Image Annotation' },
        { value: 'audio', label: 'I have prior experience in Audio Annotation' },
        { value: 'video', label: 'I have prior experience in Video Annotation' },
        { value: 'text', label: 'I have prior experience in Text Annotation' },
        { value: 'none', label: 'None' },
    ];

    if (hasEmailVerificationBeenSent) {
        history.push('/auth/email-verification-sent');
    }
    console.log('userDDDD', userDetails);



        return (



             toggle ?

                 <>
                   {    profileSettings ? <ProfileSettingsComponent userDetails={userDetails}  changeProfile={changeProfile} toggle={toggle} /> :


                        <Wrapper >
                            <div className='title-form-page ml-[5px] mx-[60px] mr-[100px] flex flex-row justify-between w-11/12' >
                                <div className='font-[700]'>Profile Setup</div>
                                <button onClick={()=>{setProfile(prevValue=>!prevValue)}} style={{color:'#355be4',display:'flex'}} className='text-[16px]'>
                                    <SettingOutlined  style={{color:'#355be4',margin:'4px 4px 0 0'}}/>
                                    <p style={{color:'#355be4'}}>Settings</p>
                                </button>


                            </div>

                            <div className='project-details-container w-11/12 mb-[15px] ml-[5px] p-[25px] '>

                                <div className='container-1'>

                                    <p className='font-[600]'>What can you expect when you complete your profile information?</p>
                                    <Link to='/auth/login' style={{color:'#355be4'}} className='underline '>What can you expect?</Link>
                                </div>

                            </div>

                            <div className='outer-container'>
                            { (section <= 6) && <>
                                <div className="side-container">
                                    <div className='side-menu'>
                                        <button onClick={() => setSection(1)} className={ section===1 ? "bg-[#F5F6F7]" : ""}>
                                            <PersonIcon style={{"height" : "1rem", }}/>
                                            BASIC INFORMATION
                                        </button>
                                    </div>
                                    <div className='side-menu'>
                                        <button onClick={() => setSection(2)} className={ section===2 ? "bg-[#F5F6F7]" : ""}>
                                            <LanguageIcon style={{"height" : "1rem", }}/>
                                            LANGUAGE
                                        </button>
                                    </div>
                                    <div className='side-menu'>
                                        <button onClick={() => setSection(3)} className={ section===3 ? "bg-[#F5F6F7]" : ""}>
                                            <LocationOnIcon style={{"height" : "1rem", }}/>
                                            LOCATION
                                        </button>
                                    </div>
                                    <div className='side-menu'>
                                        <button onClick={() => setSection(4)} className={ section===4 ? "bg-[#F5F6F7]" : ""}>
                                            <SchoolIcon style={{"height" : "1rem", }}/>
                                            EDUCATION
                                        </button>
                                    </div>
                                    <div className='side-menu'>
                                        <button onClick={() => setSection(5)} className={ section===5 ? "bg-[#F5F6F7]" : ""}>
                                            <WorkIcon style={{"height" : "1rem", }}/>
                                            PRIOR EXPERIENCE
                                        </button>
                                    </div>
                                    <div className='side-menu'>
                                        <button onClick={() => setSection(6)} className={ section===6 ? "bg-[#F5F6F7]" : ""}>
                                            <PhoneIcon style={{"height" : "1rem", }}/>
                                            PHONE NUMBER
                                        </button>
                                    </div>
                                </div>
                                <div className="form-container w-[1055px]">
                                    { (section === 1) && <>
                                        <BasicInfoForm
                                            user={user}
                                            userDetails={userDetails}
                                            genders={genders}
                                            setSection={setSection}
                                            onUpdateProfile={onUpdateProfile}
                                        />
                                    </>}
                                    { (section === 2) && <>
                                        <LanguageForm
                                            user={user}
                                            userDetails={userDetails}
                                            languageOptions={languageOptions}
                                            englishProficiencyOptions={englishProficiencyOptions}
                                            setSection={setSection}
                                            onUpdateProfile={onUpdateProfile}
                                        />
                                    </>}
                                    { (section === 3) && <>
                                        <LocationForm
                                            user={user}
                                            userDetails={userDetails}
                                            setSection={setSection}
                                            onUpdateProfile={onUpdateProfile}
                                        />
                                    </>}
                                    { (section === 4) && <>
                                        <EducationForm
                                            user={user}
                                            userDetails={userDetails}
                                            educationOptions={educationOptions}
                                            setSection={setSection}
                                            onUpdateProfile={onUpdateProfile}
                                        />
                                    </>}
                                    { (section === 5) && <>
                                        <ExperienceForm
                                            user={user}
                                            userDetails={userDetails}
                                            priorExpOptions={priorExpOptions}
                                            setSection={setSection}
                                            onUpdateProfile={onUpdateProfile}
                                        />
                                    </>}
                                    { (section === 6) && <>
                                        <PhoneNumberForm
                                            user={user}
                                            userDetails={userDetails}
                                            setSection={setSection}
                                            onUpdateProfile={onUpdateProfile}
                                        />
                                    </>}
                                </div>
                            </>}
                            </div>
                            { (section === 7) && <div>
                                <PreviewPage
                                    genders={genders}
                                    priorExpOptions={priorExpOptions}
                                    languageOptions={languageOptions}
                                    englishProficiencyOptions={englishProficiencyOptions}
                                    educationOptions={educationOptions}
                                    userDetails={userDetails}
                                    onUpdateProfile={onUpdateProfile}
                                    setSection={setSection}
                                />

                            </div>}

                        </Wrapper>
                    }
                </>

                :
                <AnnotatorProfileComponent userDetails={userDetails} changeToggle={changeToggle} toggle={toggle}  />



        );


};