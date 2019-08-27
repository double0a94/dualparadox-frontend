// constants (should be in seperate folder)
import Constants from "expo-constants";

// show flash messages
import { showMessage, hideMessage } from "react-native-flash-message";
import { AsyncStorage } from "react-native";

// Get The local ip address to connect to the local server
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/josn"
};

// All Rest Requests for the application
class LoginRegister {
  // Responsible for signing up
  signUp = (state, cb) => {
    const body = {
      email: state.email,
      password: state.password,
      confirmPassword: state.confirmPassword,
      username: state.username,
      role: state.role
    };

    fetch(uri + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        const status = response.status;
        const data = response.json();

        return Promise.all([status, data]).then(res => ({
          status: res[0],
          data: res[1]
        }));
      })
      .then(result => {
        const { status, data } = result;

        if (status == 200) {
          showMessage({
            message: "Signed Up Successfully, You can now login",
            type: "success"
          });
          cb(true);
        } else {
          let errMessageArr = data.message.map(
            errMessage => "* " + errMessage.msg + "."
          );
          let errMessageStr = errMessageArr.join("\n");
          showMessage({
            message: errMessageStr,
            type: "danger"
          });
        }
      })
      .catch(error => {
        alert("Network Error" + error);
      })
      .done();
  };

  // Responsible for logging in
  login = (state, cb) => {
    const body = {
      email: state.email,
      password: state.password
    };

    fetch(uri + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        const status = response.status;
        const data = response.json();

        return Promise.all([status, data]).then(res => ({
          status: res[0],
          data: res[1]
        }));
      })
      .then(result => {
        const { status, data } = result;

        if (status == 200) {
          cb(true, data.user);
        } else {
          let errMessageArr = data.message.map(
            errMessage => "* " + errMessage.msg + "."
          );
          let errMessageStr = errMessageArr.join("\n");
          showMessage({
            message: errMessageStr,
            type: "danger"
          });
        }
      })
      .catch(error => {
        alert("Network Error");
      })
      .done();
  };
}

export default new LoginRegister();
