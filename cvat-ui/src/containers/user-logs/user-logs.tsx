// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { connect } from 'react-redux';
import UserLogsComponent from 'components/user-logs-page/user-logs-component';
import { CombinedState } from 'reducers';
import { getUserLogsAsync } from 'actions/user-logs-actions';

interface StateToProps {
    fetching: boolean;
    initialized: boolean;
    userLogs: any;
}

interface DispatchToProps {
    fetchUserLogs: typeof getUserLogsAsync;
}

function mapStateToProps(state: CombinedState): StateToProps {
    return {
        fetching: state.userLogs.fetching,
        userLogs: state.userLogs.userLogs,
        initialized : state.userLogs.initialized,
    };
}

const mapDispatchToProps: DispatchToProps = {
    fetchUserLogs: getUserLogsAsync,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserLogsComponent);