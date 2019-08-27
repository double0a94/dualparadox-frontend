import * as React from "react";

const LogoutButton = onPress => ({ onPress }) => (
  <TouchableHighlight onPress={onPress}>
    <Text>Logout </Text>
  </TouchableHighlight>
);

export default LogoutButton;
