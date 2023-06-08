// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { ActionUnion, createAction, ThunkAction } from 'utils/redux';
import { getCore } from 'cvat-core-wrapper';

const core = getCore();

export enum UserLogsActionTypes {
    GET_USER_LOGS = 'GET_USER_LOGS',
    GET_USER_LOGS_SUCCESS = 'GET_USER_LOGS_SUCCESS',
    GET_USER_LOGS_FAILED = 'GET_USER_LOGS_FAILED',
}

const userLogsActions = {
    getUserLogs: () => createAction(UserLogsActionTypes.GET_USER_LOGS),
    getUserLogsSuccess: (userLogs: any) => createAction(UserLogsActionTypes.GET_USER_LOGS_SUCCESS, { userLogs }),
    getUserLogsFailed: (error: any) => createAction(UserLogsActionTypes.GET_USER_LOGS_FAILED, { error }),
};

export type UserLogsActions = ActionUnion<typeof userLogsActions>;

export const getUserLogsAsync = (duration: number): ThunkAction => async (dispatch): Promise<void> => {
    dispatch(userLogsActions.getUserLogs());

    try {
        const userLogs = await core.server.userLogs(duration);
        dispatch(userLogsActions.getUserLogsSuccess(userLogs));
    } catch (error) {
        dispatch(userLogsActions.getUserLogsFailed(error));
    }
};
