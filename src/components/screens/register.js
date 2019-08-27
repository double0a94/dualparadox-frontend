import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Picker,
  AsyncStorage
} from "react-native";
import { Button, ThemeProvider } from "react-native-elements";
import { createStackNavigator, createAppContainer } from "react-navigation";
import loginRegister, { LoginRegister } from "../../api/loginRegister";
import Constants from "expo-constants";
import FlashMessage from "react-native-flash-message";
import tabBarIcon from "../layout/tabBarIcon";

// Get The local ip address to connect to the local server
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

export default class Register extends React.Component {
  state = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "writer"
  };

  constructor(props) {
    super(props);

    ArrowDown = tabBarIcon("arrow-drop-down");
  }
  navToSignIn = () => {
    this.props.navigation.navigate("Home");
  };

  // callback for signup
  cb = result => {
    // check if result was successfull
    if (result) {
      this.props.navigation.navigate("Home");
    }
  };
  signUp = () => {
    loginRegister.signUp(this.state, this.cb);
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.header1}>DualParadox</Text>

          <Text style={styles.header2}>Sign Up</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            underlineColorAndroid="transparent"
          />

          <TextInput
            style={styles.textInput}
            placeholder="Name"
            onChangeText={username => this.setState({ username })}
            underlineColorAndroid="transparent"
          />

          <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
            underlineColorAndroid="transparent"
          />

          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
            underlineColorAndroid="transparent"
          />
          <View
            style={{
              width: "60%",
              flexDirection: "row",
              justifyContent: "center",

              paddingVertical: 10
            }}
          >
            <Picker
              selectedValue={this.state.role}
              style={styles.picker}
              mode="dropdown"
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ role: itemValue })
              }
            >
              <Picker.Item label="Writer" value="writer" />
              <Picker.Item label="Reader" value="reader" />
            </Picker>
            <ArrowDown tintColor={"#fff"} />
          </View>
          <TouchableOpacity style={styles.btn} onPress={this.signUp}>
            <Text>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.navToSignIn}>
            <Text style={styles.signUpButton}>
              Already Have account? Sign in here
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001f3f",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 40,
    paddingRight: 40
  },
  wrapper: {
    flex: 1
  },
  header1: {
    fontSize: 40,
    marginBottom: 60,
    color: "#fff",
    fontWeight: "bold"
  },
  header2: {
    fontSize: 24,
    marginBottom: 60,
    color: "#fff",
    fontWeight: "bold"
  },
  textInput: {
    alignSelf: "stretch",
    padding: 16,

    marginBottom: 10,
    borderRadius: 50,
    backgroundColor: "#fff"
  },
  btn: {
    alignSelf: "stretch",
    backgroundColor: "#01c853",
    padding: 20,
    alignItems: "center",
    borderRadius: 50
  },
  picker: {
    height: 50,

    color: "white",
    backgroundColor: "#0074D9",
    textAlign: "center",
    borderRadius: 15,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 10,
    marginTop: 5,
    width: "80%"
  },
  signUpButton: {
    color: "#2797DD",
    paddingBottom: 20,
    marginTop: 10,
    textDecorationLine: "underline"
  }
});
