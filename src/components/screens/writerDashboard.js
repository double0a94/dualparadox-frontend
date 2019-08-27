import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  AsyncStorage
} from "react-native";
import article from "../../api/article";
import { Buffer } from "buffer";

import Constants from "expo-constants";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";

import ArticleCards from "../layout/articleCards";
import tabBarIcon from "../layout/tabBarIcon";
import ImagePickerButton from "../layout/imagePicker";

// Get The local ip address to connect to the local server
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

export default class WriterDashboard extends React.Component {
  // Initizlize state
  state = {
    data: [],
    commentData: [],
    articleText: "",
    editArticleText: "",
    user: {},
    showEditArticle: [],
    imageUri: ""
  };

  constructor(props) {
    super(props);

    ChatIcon = tabBarIcon("chat");
    CreateIcon = tabBarIcon("create");
    ClearIcon = tabBarIcon("clear");
  }

  // convert buffer to base64
  arrayBufferToBase64(buffer) {
    return Buffer.from(buffer, "binary").toString("base64");
  }

  cb = (result, data) => {
    if (result) {
      // make edit article array false to view posts not the edit fields
      let showEditArticle = [];
      // transform array buffer to base64 to view images
      data.forEach((article, index) => {
        showEditArticle[index] = false;

        // if article has an image uri and image data
        if (article.image && article.data) {
          var base64Flag = "data:image/jpeg;base64,";

          var imageStr = this.arrayBufferToBase64(article.data.data);
          const viewableImage = base64Flag + imageStr;

          data[index].img = viewableImage;
        }
      });
      // initialize show edit article state
      this.setState({
        showEditArticle
      });

      // update article state
      this.setState({
        data
      });
    }
  };

  // Get User and all articles
  componentDidMount = () => {
    // Get User from AsyncStorage
    AsyncStorage.getItem("user")
      .then(userStorage => {
        const user = JSON.parse(userStorage);
        // if found

        if (user !== null) {
          // add user to user state
          this.setState({
            user
          });

          // Get all user's articles API
          article.getAllUserArticles(user, this.cb);
        } else {
          // Redirect to Login
          this.props.navigation.navigate("Home");
        }
      })
      .done();
  };

  publishedCb = (result, newIsPublished, articleId) => {
    if (result) {
      // update current article state
      const index = this.state.data.findIndex(x => x._id == articleId);
      let newArr = this.state.data;
      newArr[index].isPublished = newIsPublished;

      this.setState({
        data: newArr
      });
    }
  };

  // Publish or unPublish switch handler
  isPublishedSwitch = articleId => {
    // Publish/unpublish API
    article.isPublishedSwitch(this.state, articleId, this.publishedCb);
  };

  showEditArticle = index => {
    const newArr = this.state.showEditArticle;
    newArr[index] = newArr[index] ? false : true;
    this.setState({
      showEditArticle: newArr
    });
  };

  writArticleCb = (result, article) => {
    if (result) {
      let newArr = this.state.data;
      // add new random id for the new article
      article._id = newArr.length + 1;
      newArr.push(JSON.stringify(article));
      // add them to the current state
      this.setState({
        data: newArr
      });
    }
  };

  // Write or Edit articles
  // articleId is defiend => Edit Article
  // articleId is undefiend => Save Article
  writeArticle = articleId => {
    article.writeOrEditArticle(this.state, articleId, this.writArticleCb);
  };

  getImage = imageUri => {
    this.setState({ imageUri });
  };

  // Deletes an Article
  deleteArticle = articleId => {
    fetch(uri + "/article/delete/" + articleId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.state.user.token
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
          let newArr = this.state.data;
          const index = newArr.findIndex(x => x._id == articleId);
          newArr.splice(index, 1);
          this.setState({
            data: newArr
          });
          showMessage({
            message: "Successfully Deleted",
            type: "success"
          });
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

  render() {
    return (
      <View style={styles.container}>
        {/* Write new Article card */}
        <View style={styles.card}>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.newArticleTextArea}
              multiline={true}
              numberOfLines={4}
              maxLength={2000}
              placeholder="Write New Article"
              onChangeText={articleText => this.setState({ articleText })}
              value={this.state.articleText}
            />
          </View>

          <View style={styles.writeArticleFooter}>
            <Text style={styles.time}>
              {this.state.articleText.length}/2000
            </Text>

            <ImagePickerButton callback={imageUri => this.getImage(imageUri)} />

            <TouchableOpacity
              onPress={() => this.writeArticle()}
              style={styles.saveArticleButton}
            >
              <Text style={styles.socialBarlabel}>Save Article</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* End of Write new Article */}

        <Text style={styles.articlesHeader}>Your Articles:</Text>

        <FlatList
          style={styles.list}
          data={this.state.data}
          keyExtractor={item => {
            return item._id;
          }}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator} />;
          }}
          renderItem={post => {
            const item = post.item;
            return (
              <View>
                {/* User's Article list */}
                {/* if showEditArticle then view posts */}
                {!this.state.showEditArticle[post.index] && (
                  <ArticleCards
                    isPublishedSwitch={() => this.isPublishedSwitch(item._id)}
                    item={item}
                    showEditArticle={() => this.showEditArticle(post.index)}
                    deleteArticle={() => this.deleteArticle(item._id)}
                  />
                )}

                {/* Show Edit Article */}
                {this.state.showEditArticle[post.index] && (
                  <View style={styles.card}>
                    <TextInput
                      style={styles.newArticleTextArea}
                      multiline={true}
                      numberOfLines={4}
                      maxLength={2000}
                      onChangeText={editArticleText =>
                        this.setState({ editArticleText })
                      }
                      defaultValue={item.articleText}
                    />
                    <Text>{this.state.articleText.length}/2000</Text>
                    <ImagePickerButton
                      callback={imageUri => this.getImage(imageUri)}
                    />

                    <TouchableOpacity
                      onPress={() => this.writeArticle(item._id)}
                      style={styles.saveArticleButton}
                    >
                      <Text style={styles.socialBarlabel}>Save Article</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
        <FlashMessage position="top" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginVertical: 8,
    borderRadius: 15,
    backgroundColor: "white"
  },
  list: {
    paddingHorizontal: 17,
    backgroundColor: "#E6E6E6"
  },
  separator: {
    marginTop: 10
  },
  articlesHeader: {
    fontWeight: "bold",
    fontSize: 25
  },
  icon: {
    width: 25,
    height: 25
  },
  saveArticleButton: {
    backgroundColor: "green",
    color: "white",
    borderRadius: 15,
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  newArticleTextArea: {
    textAlign: "center",
    height: 50,
    borderWidth: 2,
    borderColor: "#9E9E9E",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    height: 150
  },
  textAreaContainer: {
    flex: 1,
    paddingTop: 40,
    justifyContent: "center",
    margin: 15,
    marginBottom: 30
  },
  time: {
    fontSize: 13,
    color: "#808080",
    marginTop: 5
  },
  writeArticleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1
  },
  socialBarlabel: {
    color: "#fff"
  }
});
