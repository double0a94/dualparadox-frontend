import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  TouchableHighlight
} from "react-native";
import { Button, ThemeProvider } from "react-native-elements";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import FlashMessage from "react-native-flash-message";

import Login from "./src/components/screens/login";
import DefaultDashboard from "./src/components/screens/defaultDashboard";
import WriterDashboard from "./src/components/screens/writerDashboard";
import Register from "./src/components/screens/register";
import tabBarIcon from "./src/components/layout/tabBarIcon";

const BottomNavigation = createMaterialBottomTabNavigator(
  {
    DefaultDashboard: {
      screen: DefaultDashboard,
      navigationOptions: {
        tabBarIcon: tabBarIcon("assignment")
      }
    },
    WriterDashboard: {
      screen: WriterDashboard,
      navigationOptions: {
        tabBarIcon: tabBarIcon("account-circle")
      }
    }
  },
  {
    initialRouteName: "DefaultDashboard",
    activeColor: "#fff",
    inactiveColor: "#7FDBFF",
    barStyle: { backgroundColor: "#0074D9" }
  }
);

const Left = ({ onPress }) => (
  <TouchableHighlight onPress={onPress} style={styles.logoutButton}>
    <Text>Logout</Text>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  logoutButton: {}
});

// App's Stack Navagitors
const applicationNavigation = createStackNavigator({
  Home: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },
  WriterDashboard: {
    screen: BottomNavigation,
    navigationOptions: {
      title: "logout",
      headerTitleStyle: {
        fontSize: 14
      },
      tabBarVisible: false,
      headerStyle: {
        backgroundColor: "#4A94FB",
        borderBottomColor: "transparent"
      },
      headerTintColor: "white",
      headerBackTitle: null
    }
  },
  DefaultDashboard: {
    screen: DefaultDashboard,
    navigationOptions: {
      title: "logout",
      headerTitleStyle: {
        fontSize: 14
      },
      tabBarVisible: false,
      headerStyle: {
        backgroundColor: "#4A94FB",
        borderBottomColor: "transparent"
      },
      headerTintColor: "white",
      headerBackTitle: null
    }
  },
  SignUp: {
    screen: Register,
    navigationOptions: {
      header: null
    }
  }
});

const AppContainer = createAppContainer(applicationNavigation);

// Render the App Components
export default class App extends React.Component {
  render() {
    return [
      <AppContainer key="container" />,
      <FlashMessage position="top" key="messages" />
    ];
  }
}
