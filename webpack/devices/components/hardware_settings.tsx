import * as React from "react";
import { MCUFactoryReset, bulkToggleControlPanel } from "../actions";
import { Widget, WidgetHeader, WidgetBody, SaveBtn } from "../../ui/index";
import { HardwareSettingsProps } from "../interfaces";
import { MustBeOnline } from "../must_be_online";
import { ToolTips } from "../../constants";
import { DangerZone } from "./hardware_settings/danger_zone";
import { PinGuard } from "./hardware_settings/pin_guard";
import { EncodersAndEndStops } from "./hardware_settings/encoders_and_endstops";
import { Motors } from "./hardware_settings/motors";
import { SpacePanelHeader } from "./hardware_settings/space_panel_header";
import {
  HomingAndCalibration
} from "./hardware_settings/homing_and_calibration";
import { SpecialStatus } from "../../resources/tagged_resources";

export class HardwareSettings extends
  React.Component<HardwareSettingsProps, {}> {

  render() {
    const { bot, dispatch, sourceFbosConfig } = this.props;
    const { sync_status } = this.props.bot.hardware.informational_settings;
    return <Widget className="hardware-widget">
      <WidgetHeader title="Hardware" helpText={ToolTips.HW_SETTINGS}>
        <MustBeOnline
          hideBanner={true}
          syncStatus={sync_status}
          networkState={this.props.botToMqttStatus}
          lockOpen={process.env.NODE_ENV !== "production"}>
          <SaveBtn
            status={bot.isUpdating ? SpecialStatus.SAVING : SpecialStatus.SAVED}
            dirtyText={" "}
            savingText={"Updating..."}
            savedText={"saved"}
            hidden={false} />
        </MustBeOnline>
      </WidgetHeader>
      <WidgetBody>
        <button
          className={"fb-button gray no-float"}
          onClick={() => dispatch(bulkToggleControlPanel(true))}>
          Expand All
          </button>
        <button
          className={"fb-button gray no-float"}
          onClick={() => dispatch(bulkToggleControlPanel(false))}>
          Collapse All
          </button>
        <MustBeOnline
          networkState={this.props.botToMqttStatus}
          syncStatus={sync_status}
          lockOpen={process.env.NODE_ENV !== "production"}>
          <div className="label-headings">
            <SpacePanelHeader />
          </div>
          <HomingAndCalibration
            dispatch={dispatch}
            bot={bot} />
          <Motors
            dispatch={dispatch}
            bot={bot}
            sourceFbosConfig={sourceFbosConfig} />
          <EncodersAndEndStops
            dispatch={dispatch}
            bot={bot} />
          <PinGuard
            dispatch={dispatch}
            bot={bot} />
          <DangerZone
            dispatch={dispatch}
            bot={bot}
            onReset={MCUFactoryReset} />
        </MustBeOnline>
      </WidgetBody>
    </Widget>;
  }
}
