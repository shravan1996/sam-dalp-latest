// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Icon from '@ant-design/icons';

import { CursorIcon } from 'icons';
import { ActiveControl } from 'reducers';
import { Canvas } from 'cvat-canvas-wrapper';
import { Canvas3d } from 'cvat-canvas3d-wrapper';
import CVATTooltip from 'components/common/cvat-tooltip';
import CursorIcon1 from '../../../../assets/cursor-icon1.svg';

export interface Props {
    canvasInstance: Canvas | Canvas3d;
    cursorShortkey: string;
    activeControl: ActiveControl;
}

function CursorControl(props: Props): JSX.Element {
    const { canvasInstance, activeControl, cursorShortkey } = props;

    return (
        <CVATTooltip title={`Cursor ${cursorShortkey}`} placement='right'>
            {/*<Icon
                component={CursorIcon}
                className={
                    activeControl === ActiveControl.CURSOR ?
                        'cvat-active-canvas-control cvat-cursor-control' :
                        'cvat-cursor-control'
                }
                onClick={activeControl !== ActiveControl.CURSOR ? (): void => canvasInstance.cancel() : undefined}
            />*/}
            <CursorIcon1
                style={{marginTop:'9px',marginBottom:'12px',marginLeft:'7px'}}
                onClick={activeControl !== ActiveControl.CURSOR ? (): void => canvasInstance.cancel() : undefined}
            />
        </CVATTooltip>
    );
}

export default React.memo(CursorControl);
