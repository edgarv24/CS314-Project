import blueGrey from "@material-ui/core/colors/blueGrey";
import Control from "react-leaflet-control";
import {IconButton, Paper, Tooltip, Zoom} from "@material-ui/core";
import React from "react";

const MapButton = ({buttonID, buttonIcon, mapPosition, tooltipText, tooltipPlacement, disabled, toggledOn, onClick}) => {
    const disabledText = disabled ? " (disabled)" : "";
    const ICON_COLOR = toggledOn ? undefined : blueGrey[200];
    return (
        <Control position={mapPosition}>
            <Tooltip title={tooltipText + disabledText} placement={tooltipPlacement} TransitionComponent={Zoom} arrow>
                <Paper elevation={4}>
                    <IconButton id={buttonID} onClick={onClick} disabled={disabled} size="small"
                                color="inherit" style={{ color: ICON_COLOR }}>
                        {buttonIcon}
                    </IconButton>
                </Paper>
            </Tooltip>
        </Control>
    );
}

export default MapButton;