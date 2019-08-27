import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import loginRegister from "../../api/loginRegister";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  componentDidMount() {
    this._loadInitialState().done();
  }

  // login from async storage (if had a successful log in before)
  _loadInitialState = async () => {
    await AsyncStorage.getItem("user").then(userStorage => {
      const user = JSON.parse(userStorage);
      if (user !== null) {
        if (user.role === "writer")
          this.props.navigation.navigate("WriterDashboard");
        else this.props.navigation.navigate("DefaultDashboard");
      }
    });
  };

  // Go to sign up page
  navToSignUp = () => {
    this.props.navigation.navigate("SignUp");
  };

  // Callback for successful login
  cb = (result, user) => {
    if (result) {
      AsyncStorage.setItem("user", JSON.stringify(user)).catch(err => {
        alert("Session Error. Please Try again");
      });

      // Check for user role
      if (user.role === "writer")
        this.props.navigation.navigate("WriterDashboard");
      else this.props.navigation.navigate("DefaultDashboard");
    }
  };

  // login the user
  login = () => {
    loginRegister.login(this.state, this.cb);
    // LoginRegister.login(JSON.stringify(bodyParam))
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.header1}>DualParadox</Text>

          <Text style={styles.header2}>Login</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            underlineColorAndroid="transparent"
          />

          <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
            underlineColorAndroid="transparent"
          />

          <TouchableOpacity style={styles.btn} onPress={this.login}>
            <Text>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.navToSignUp}>
            <Text style={styles.signUpButton}>
              Don't have an account? Sign up here{" "}
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
    marginBottom: 30,
    alignItems: "center",
    borderRadius: 50
  },
  signUpButton: {
    color: "#2797DD",
    paddingBottom: 20,
    textDecorationLine: "underline"
  }
});
