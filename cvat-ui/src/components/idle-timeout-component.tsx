import React, { useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { saveLogsAsync } from 'actions/annotation-actions';
import { logoutAsync } from 'actions/auth-actions';

function IdleTimerComponent() : JSX.Element {
    const dispatch = useDispatch();
    const history = useHistory();

    const performLogout = async () => {
        dispatch(saveLogsAsync()).then(() => {
            dispatch(logoutAsync()).then(() => {
                history.goBack();
            });
        });
    };

    const { start, pause } = useIdleTimer({
        timeout: 5*60*1000,     // = 5minutes
        onIdle: (            console.log('User is idle');
            performLogout();
        },
        onActive: () => {
            console.log('User is active');
        },
        debounce: 500,
    });

    useEffect(() => {
        start();
        return () => { pause(); };
    }, []);

    return (<></>);
}

export default IdleTimerComponent;
