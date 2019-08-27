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

class Article {
  getAllUserArticles = (user, cb) => {
    fetch(uri + "/article/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": user.token
      }
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
          //found article(s)
          if (data.data.length > 0) {
            showMessage({
              message: "All articles gathered correctly",
              type: "success"
            });
          } else {
            showMessage({
              message: "No article have been posted yet!",
              type: "warning"
            });
          }

          cb(true, data.data);
        } else {
          showMessage({
            message: "Error Collecting Articles",
            type: "error"
          });
        }
      })
      .catch(error => {
        alert("Server Error: " + error);
      })
      .done();
  };

  // publish or unpublish article
  isPublishedSwitch = (state, articleId, cb) => {
    // Get article from state
    const pressedArticle = state.data.filter(x => x._id == articleId);
    // invert isPublished value

    const newIsPublished = pressedArticle[0].isPublished ? false : true;

    bodyParam = {
      updatedArticle: {
        isPublished: newIsPublished
      }
    };

    // update the article
    fetch(uri + "/article/update/" + articleId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": state.user.token
      },
      body: JSON.stringify(bodyParam)
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
          // show success message
          showMessage({
            message: data.message,
            type: "success"
          });
          cb(true, newIsPublished, articleId);
        } else {
          // show error message
          showMessage({
            message: data.message,
            type: "danger"
          });
        }
      })
      .catch(error => {
        alert("Server Error2: " + error);
      })
      .done();
  };

  writeOrEditArticle = (state, articleId, cb) => {
    // Get the body Paramter
    let bodyParam;
    if (!articleId) {
      bodyParam = {
        article: {
          userId: state.user._id,
          username: state.user.username,
          articleText: state.articleText
        }
      };
    } else {
      bodyParam = {
        article: {
          userId: state.user._id,
          username: state.user.username,
          articleText: state.editArticleText
        }
      };
    }

    // Creat a form data object
    let formData = new FormData();

    // add article object to the form object
    if (!articleId)
      formData.append("article", JSON.stringify(bodyParam.article));
    else formData.append("updatedArticle", JSON.stringify(bodyParam.article));

    // upload image if there is image selected
    // and add it to the form object
    if (state.imageUri != "") {
      const imageUri = state.imageUri;
      let uriParts = imageUri.split(".");
      let fileType = uriParts[uriParts.length - 1];

      formData.append("image", {
        uri: imageUri,
        name: `image.${fileType}`,
        type: `image/${fileType}`
      });
    }

    // set the API and the method for the REST request
    let api, method;

    if (!articleId) {
      api = "/article/save";
      method = "POST";
    } else {
      api = "/article/update/" + articleId;
      method = "PUT";
    }

    fetch(uri + api, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "x-access-token": state.user.token
      },
      body: formData
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
            message: "Your Articles Updated Successfully",
            type: "success"
          });
          cb(true, bodyParam.article);
        } else {
          showMessage({
            message: "An error occured, please try again later",
            type: "danger"
          });
        }
      })
      .catch(error => {
        alert("Server Error write article" + error);
      })
      .done();
  };
}

export default new Article();
