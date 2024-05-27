import React from "react";
import DeviceInfo from "react-native-device-info";
import { Analytics, Hits as GAHits } from 'react-native-google-analytics';

import Settings from "./Settings";


class Screen extends React.Component {
    componentDidMount() {
        ga = new Analytics(Settings.analyticsCode, DeviceInfo.getUniqueId(), 1, DeviceInfo.getUserAgent());
        var screenView = new GAHits.ScreenView(
            Settings.analyticsAppName,
            this.constructor.name,
            DeviceInfo.getReadableVersion(),
            DeviceInfo.getBundleId()
        );
        ga.send(screenView);
    }

    googleAnalyticsView ( screenName ) {
        ga = new Analytics(Settings.analyticsCode, DeviceInfo.getUniqueId(), 1, DeviceInfo.getUserAgent());
        var screenView = new GAHits.ScreenView(
            Settings.analyticsAppName,
          screenName,
          DeviceInfo.getReadableVersion(),
          DeviceInfo.getBundleId()
        );
        ga.send(screenView);
    }
}

export default Screen;