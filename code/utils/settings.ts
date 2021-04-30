import Constants from "expo-constants";

export default {
  showDevTools: Constants?.manifest?.extra?.hideDevTools,
};
