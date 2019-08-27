import * as React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Image,
    FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const commentCards = data =>  ({ item }) => (
    <View>
        <FlatList
             data={data}
             keyExtractor= {(item) => {
               return item._id;
             }}
             ItemSeparatorComponent={() => {
               return (

                   <View style={styles.separator}/>
               )
             }}
             renderItem={(post) => {
                const item2 = post.item;
                return (
                    <View style={styles.commentContainer}>
                        <Text style={styles.username}>{item2.username}: </Text>
                        <Text style={styles.comment}>{item2.commentText}</Text>
                    </View>
                
                )
            }}
        />
    </View>
) 
const styles = StyleSheet.create({
    separator: {
        marginTop: 5,
        marginBottom: 5,
      },
    username: {
        fontWeight: 'bold'
    },
    commentContainer: {
        display:'flex',
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection: 'row',
        paddingLeft: 25
    }
})

export default commentCards;