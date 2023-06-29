import React from 'react';
import './styles.scss';
import { Progress} from 'antd';
import Button from 'antd/lib/button';
import {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CombinedState } from 'reducers';
import { ArrowRightOutlined } from '@ant-design/icons';

interface UserProps{
    userDetails: any ;
    changeToggle: any;
    toggle: any;
}

export default function AnnotatorProfileComponent(props: UserProps): JSX.Element {



    const {userDetails, changeToggle, toggle} = props ;

    const buttonClick = ()=>{
        changeToggle(!toggle)
    }

    const history = useHistory();



    const profilePercentage = (userDetails :any)=>{
        if(!userDetails) return 0;

        let totalInputs = 0;
        let filledInputs = 0;


        if(userDetails!==null)
            for (let key in userDetails) {
                    let value = userDetails[key];
                    totalInputs++;
                    if(value)   filledInputs++;
            }

        const percentage = Math.floor((filledInputs / totalInputs) * 100) ;
        return percentage ;

    }

    const percentage = profilePercentage(userDetails) ;


    return(
        <div className='project-details-page '>

            <div className='project-details-container mt-[20px] mx-[60px] p-[25px] mr-[100px]'>

                <div className='container-1'>
                    <h3 className='mb-[20px] text-xl text-base font-bold'>Complete your profile</h3>
                    <p className='font-[550]' style={{color:'black'}}>What can you expect when you complete your profile information?</p>
                    <Link to='/auth/login' style={{color:'#355be4'}} className='underline '>What can you expect?</Link>
                </div>

                <div className='mr-[80px] flex flex-row container-2'>
                    <Progress type="circle" percent={percentage} strokeColor={{ '0%': '#7E96EA', '100%': '#355be4' }} />

                    <div className='ml-[100px]'>
                        <h3 className='font-bold text-lg'>Unlock long-term projects</h3>

                        <Button
                            type='primary'
                            htmlType='submit'
                            className='cvat-credentials-action-button2'
                            onClick={buttonClick}

                        >
                            <div className='flex flex-row'>
                                Continue Profile
                                <ArrowRightOutlined style={{marginLeft:'4px',marginTop:'5px'}}/>

                            </div>

                        </Button>

                    </div>



                </div>

            </div>

            <div className='go-to-projects-link mt-[20px] text-center'>


                <Link to='/auth/login' style={{color:'#355be4'}} className='underline '>Go to projects <ArrowRightOutlined style={{ color: '#355be4' }}/></Link>

            </div>

        </div>

    )

}