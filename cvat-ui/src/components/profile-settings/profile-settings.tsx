import React from 'react';
import './styles.scss';
import { Switch } from 'antd';
import { Progress} from 'antd';
import Button from 'antd/lib/button';
import {useState} from 'react';

import { useSelector } from 'react-redux';
import { CombinedState } from 'reducers';
import { ArrowRightOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';



export default function ProfileSettingsComponent(): JSX.Element {

    const changeSwitch = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };



    return(
        <div className='project-details-page '>



                <div className='mt-[20px] mx-[60px] mr-[100px] flex flex-row justify-between ' >
                    <h1 className='font-[700]'>Profile Settings</h1>
                    <Link to='/profile/settings' style={{color:'#355be4',display:'flex'}} className='underline' >

                        <p  style={{color:'#355be4'}}>Back to profile</p>
                    </Link>

                </div>

                <div className=' flex flex-col project-details-container mt-[20px] mx-[60px] p-[25px] mr-[100px]'>

                    <div className='container-11 flex flex-row justify-between'>
                        <div>
                            <h2 className='font-normal '>Aravind kumar</h2>
                            <p >Aravind.kumar@gmail.com</p>
                        </div>
                        <p style={{color:'#023E8A'}}>Request change</p>

                    </div>


                    <div className='container-12 flex flex-row justify-between'>
                        <div>
                            <h5>Country</h5>
                            <p>India</p>
                        </div>
                        <div>
                            <h5>State</h5>
                            <p>Tamilnadu</p>
                        </div>
                        <div>
                            <h5>Your primary language</h5>
                            <p>English</p>
                        </div>
                        <div>
                            <h5>Your language region</h5>
                            <p>India</p>
                        </div>
                        <div>
                            <h5>Contract type</h5>
                            <p>Independent Contractor</p>
                        </div>

                    </div>

                </div>





                <div className='flex flex-col project-details-container mt-[20px] mx-[60px] p-[25px] mr-[100px]'>
                    <div>
                        <h2 className='font-normal '>Notification Preferences</h2>
                        <p className='mt-[3px]' >Enable the options that you desire to receive</p>
                        <div className='flex flex-row '>
                            <h3 className='mr-[5px]'>New Opportunities</h3>
                            <Switch defaultChecked onChange={changeSwitch} style={{color:'#030973'}}/>
                        </div>
                    </div>

                    <div>
                        <h2 className='font-normal '>Deactivate Account</h2>
                        <p className='mt-[3px]' >Click the button to withdraw from all existing application and deactivate your account</p>
                        <div className='mt-[30px] rounded-xl ml-[45px]'>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='cvat-credentials-action-button'

                                >
                                    Deactivate account
                                </Button>
                        </div>
                    </div>

                </div>







        </div>

    )

}