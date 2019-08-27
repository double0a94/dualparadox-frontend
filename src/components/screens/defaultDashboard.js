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
  SectionList,
  AsyncStorage
} from "react-native";
import { Button, ThemeProvider } from "react-native-elements";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { LoginRegister } from "../../api/loginRegister";
import { Buffer } from "buffer";

import Constants from "expo-constants";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import tabBarIcon from "../layout/tabBarIcon";
import commentCards from "../layout/commentCards";

// Get The local ip address to connect to the local server
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(":").shift()}:3000`;

export default class DefaultDashboard extends React.Component {
  state = {
    data: [],
    commentData: [],
    commentText: "",
    isHidden: [],
    writeCommentIsHidden: [],
    user: {}
  };

  constructor(props) {
    super(props);

    // get tabbaricons
    ChatIcon = tabBarIcon("chat");
    CreateIcon = tabBarIcon("create");
  }

  // convert buffer to base64
  arrayBufferToBase64(buffer) {
    return Buffer.from(buffer, "binary").toString("base64");
  }

  // Get All the Comments
  loadComments = user => {
    fetch(uri + "/comment/all", {
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
          this.setState({
            commentData: data.data
          });
          this.addCommentsToArticles();
        } else {
        }
      })
      .catch(error => {
        alert("Network Error4" + error);
      })
      .done();
  };
  // adding comments to the articles
  addCommentsToArticles = () => {
    let articlesWithComments = [];
    if (this.state.data.length > 0) {
      this.state.data.forEach((article, index) => {
        // initizlize array of comments for this article
        article.comments = [];
        this.state.commentData.forEach((comment, commentIndex) => {
          if (article._id == comment.articleId) {
            article.comments.push(comment);
          }
        });
        // add show comments for this article boolean
        article.hideComments = false;
        article.writeCommentIsHidden = false;
        // new article with comments array
        articlesWithComments.push(article);
      });

      // add show or hide comments or write comments to state
      this.setState({
        isHidden: articlesWithComments.map(x => x.hideComments)
      });
      this.setState({
        writeCommentIsHidden: articlesWithComments.map(
          x => x.writeCommentIsHidden
        )
      });
      this.setState({
        data: articlesWithComments
      });
    }
  };

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
          fetch(uri + "/article/all", {
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
                data.data.forEach((article, index) => {
                  // if article has an image uri and image data

                  if (article.image && article.data) {
                    var base64Flag = "data:image/jpeg;base64,";

                    var imageStr = this.arrayBufferToBase64(article.data.data);
                    const viewableImage = base64Flag + imageStr;

                    data.data[index].img = viewableImage;
                  }
                });

                this.setState({
                  data: data.data
                });
                this.loadComments(user);
              } else {
              }
            })
            .catch(error => {
              alert("Network Error3" + error);
            })
            .done();
        } else {
          // Redirect to Login
          this.props.navigation.navigate("Home");
        }
      })
      .done();
  };

  // Show or Hide Trigger for comments section
  hideComments = index => {
    let newArr = this.state.isHidden;
    newArr[index] = this.state.isHidden[index] ? false : true;
    this.setState({ isHidden: newArr });
  };

  // Show or Hide Trigger for write comment section
  hideWriteComments = index => {
    let newArr = this.state.writeCommentIsHidden;
    newArr[index] = this.state.writeCommentIsHidden[index] ? false : true;
    this.setState({ writeCommentIsHidden: newArr });
  };

  writeComment = (articleId, index) => {
    let bodyParam = {
      comment: {
        articleId,
        userId: this.state.user._id,
        username: this.state.user.username,
        commentText: this.state.commentText
      }
    };
    fetch(uri + "/comment/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.state.user.token
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
          let newArr = this.state.data;
          bodyParam.comment._id = newArr[index].comments.length + 1;
          newArr[index].comments.push(bodyParam.comment);
          this.setState({
            data: newArr
          });
          showMessage({
            message: "Comment Added",
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
        alert("Server Error write comment" + error);
      })
      .done();
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.state.data}
          extraData={this.state.commentData}
          keyExtractor={item => {
            return item._id;
          }}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator} />;
          }}
          renderItem={post => {
            const item = post.item;
            CommentCards = commentCards(item.comments);
            return (
              <View style={styles.card}>
                <Image style={styles.cardImage} source={{ uri: item.img }} />

                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.title}>{item.articleText}</Text>
                    <Text style={styles.time}>{item.updatedAt}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.socialBarContainer}>
                    <View style={styles.socialBarSection}>
                      <TouchableOpacity
                        onPress={() => this.hideWriteComments(post.index)}
                        style={styles.socialBarButton}
                      >
                        <CreateIcon name="create" />
                        <Text style={styles.socialBarlabel}>Write Comment</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.socialBarSection}>
                      <TouchableOpacity
                        onPress={() => this.hideComments(post.index)}
                        style={styles.socialBarButton}
                      >
                        <ChatIcon name="chat" />
                        <Text style={styles.socialBarlabel}>Show Comments</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Write Comment */}
                {this.state.writeCommentIsHidden[post.index] && (
                  <View style={styles.cardFooter}>
                    <TextInput
                      placeholder="Write comment ..."
                      maxLength={2000}
                      onChangeText={commentText =>
                        this.setState({ commentText })
                      }
                    />
                    <TouchableOpacity
                      onPress={() => this.writeComment(item._id, post.index)}
                    >
                      <Text>done</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Comments FlatList */}
                {this.state.isHidden[post.index] && (
                  <CommentCards name={item.comments} />
                )}
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  list: {
    paddingHorizontal: 17,
    backgroundColor: "#E6E6E6"
  },
  separator: {
    marginTop: 10
  },
  commentSeparator: {
    borderBottomColor: "black",
    borderBottomWidth: 1
  },
  /******** card **************/
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
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1
  },
  cardImage: {
    marginTop: 30,
    flex: 1,
    height: 150,
    width: null
  },
  /******** card components **************/
  title: {
    fontSize: 18,
    flex: 1
  },
  time: {
    fontSize: 13,
    color: "#808080",
    marginTop: 5
  },
  icon: {
    width: 25,
    height: 25
  },
  /******** social bar ******************/
  socialBarContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1
  },
  socialBarSection: {
    justifyContent: "center",
    flexDirection: "row",
    flex: 1
  },
  socialBarlabel: {
    marginLeft: 8,
    paddingBottom: 3,
    alignSelf: "flex-end",
    justifyContent: "center"
  },
  socialBarButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});
