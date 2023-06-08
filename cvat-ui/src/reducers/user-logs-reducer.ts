// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

// import { getCore } from 'cvat-core-wrapper';
// import { CanvasVersion } from 'cvat-canvas-wrapper';
import { BoundariesActions, BoundariesActionTypes } from 'actions/boundaries-actions';
import { UserLogsActionTypes, UserLogsActions } from 'actions/user-logs-actions';
import { AuthActions, AuthActionTypes } from 'actions/auth-actions';
import { UserLogsState } from '.';

const defaultState: UserLogsState = {
    userLogs: {},
    fetching: false,
    initialized: false,
};

export default function (
    state: UserLogsState = defaultState,
    action: UserLogsActions | AuthActions | BoundariesActions,
): UserLogsState {
    switch (action.type) {
        case UserLogsActionTypes.GET_USER_LOGS: {
            return {
                ...state,
                fetching: true,
                initialized: false,
            };
        }
        case UserLogsActionTypes.GET_USER_LOGS_SUCCESS:
            return {
                ...state,
                fetching: false,
                initialized: true,
                userLogs: action.payload.userLogs,
            };
        case UserLogsActionTypes.GET_USER_LOGS_FAILED:
            return {
                ...state,
                fetching: false,
                initialized: true,
            };
        case AuthActionTypes.LOGOUT_SUCCESS:
        case BoundariesActionTypes.RESET_AFTER_ERROR: {
            return {
                ...defaultState,
            };
        }
        default:
            return state;
    }
}
