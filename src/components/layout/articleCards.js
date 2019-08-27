import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Switch,
  FlatList
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ArticleCards = props => (
  <View style={styles.card}>
    <Switch
      onValueChange={props.isPublishedSwitch}
      value={props.item.isPublished}
    />

    <Image style={styles.cardImage} source={{ uri: props.item.img }} />

    <View style={styles.cardHeader}>
      <View>
        <Text style={styles.title}>{props.item.articleText}</Text>
        <Text style={styles.time}>{props.item.updatedAt}</Text>
      </View>
    </View>

    <View style={styles.cardFooter}>
      <View style={styles.socialBarContainer}>
        <View style={styles.socialBarSection}>
          <TouchableOpacity
            style={styles.socialBarButton}
            onPress={props.showEditArticle}
          >
            <CreateIcon name="create" />
            <Text style={styles.socialBarlabel}>Edit Article</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.socialBarSection}>
          <TouchableOpacity
            onPress={props.deleteArticle}
            style={styles.socialBarButton}
          >
            <ClearIcon name="red" />
            <Text style={styles.socialBarlabel}>Delete Article</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    flex: 1
  },
  time: {
    fontSize: 13,
    color: "#808080",
    marginTop: 5
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
    alignSelf: "flex-end",
    justifyContent: "center"
  },
  socialBarButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ArticleCards;
