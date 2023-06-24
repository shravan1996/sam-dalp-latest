// Copyright (C) 2021-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT
import { connect } from 'react-redux';
import React from 'react';
import { CombinedState } from 'reducers';
import UpdateProfileForm from 'components/update-profile/profile-form';
import { updateProfileAsync } from 'actions/auth-actions';

interface StateToProps {
    user: any,
    userDetails: any,
    fetching: boolean;
    hasEmailVerificationBeenSent: boolean;
}

interface DispatchToProps {
    onUpdateProfile: typeof updateProfileAsync;
}

const mapDispatchToProps: DispatchToProps = {
    onUpdateProfile: updateProfileAsync,
};

function mapStateToProps(state: CombinedState): StateToProps {
    return {
        user: state.auth.user,
        userDetails: state.auth.userDetails,
        fetching: state.auth.fetching,
        hasEmailVerificationBeenSent: state.auth.hasEmailVerificationBeenSent,
    };
}

// function mapDispatchToProps(dispatch: any): DispatchToProps {
//     return {
//         onUpdateProfile (values: any) {
//             try {
//                 dispatch(updateProfileAsync(values))
//                 console.log(values);
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     }
// };

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileForm);