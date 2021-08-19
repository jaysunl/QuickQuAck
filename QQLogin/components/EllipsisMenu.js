import React, { useState, Component } from 'react';
import { Dimensions, Platform, StyleSheet, Text, Alert, TouchableHighlight } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serverIp } from '../screens/Login.js';


const { SlideInMenu } = renderers;

const EllipsisMenu = ({ navigation, postText, postUser, postOwner, postId, JWTtoken }) => {

  //When user clicks on icon to update post
  const updatePost = () => {
    const postType = {
      post_type: 'Update',
      post_text: postText,
      post_id: postId,
    };
    navigation.navigate('Create Post', { postType });
  };

  //When user clicks on icon to delete post
  const deletePost = () => {
    Alert.alert('Delete Post?', 'Would you like to delete this post?', [
      //Delete post from DB
      {
        text: 'Yes',
        onPress: () => {
          sendToDB();
          navigation.pop();
          alert('Post Deleted');
        },
      },
      { text: 'No' },
    ]);
  };

  const sendToDB = async () => {

    const body = {postId: postId};
    try {
      const response = await fetch('http://' + serverIp + ':5000/feed/delete-post', {
        method: 'DELETE',
        headers: { token: JWTtoken, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      console.log('DELETE: ' + JSON.stringify(parseRes));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Menu renderer={SlideInMenu}>
      {/* Slide-in Menu from the bottom is triggered by the Ellipsis (...) button */}
      <MenuTrigger customStyles={triggerStyles}>
        <MaterialCommunityIcons name="dots-horizontal" color="#BDBDBD" size={height * 0.035}/>
      </MenuTrigger>

      {/* Three menu options: Send Message, Flag as inappropriate, Block Posts from User */}
      <MenuOptions style={{ paddingBottom: 25, paddingTop: 8 }}>
        {/* Send Message */}
        <MenuOption
          style={{ paddingVertical: 10 }}
          onSelect={() => {
            Alert.alert('Send Message to User?', 'Would you like to send a message to this user?', [
              { text: 'Yes', onPress: () => console.log('User Pressed Yes') },
              { text: 'No', onPress: () => console.log('User Pressed No') },
            ]);
          }}
        >
          <Text style={styles.text}>Send Message</Text>
        </MenuOption>

        {/* Flag as Inappropriate */}
        <MenuOption onSelect={() => navigation.navigate('Flag Post', {post: postText, user: postUser})} style={{ paddingVertical: 10 }}>
          <Text style={styles.text}>Flag as inappropriate</Text>
        </MenuOption>

        {/* Block Posts from User */}
        <MenuOption
          style={{ paddingVertical: 10 }}
          onSelect={() => {
            Alert.alert('Block Posts from User?', 'Would you like to block posts from this user?', [
              { text: 'Yes', onPress: () => console.log('User Pressed Yes') },
              { text: 'No', onPress: () => console.log('User Pressed No') },
            ]);
          }}
        >
          <Text style={styles.text}>Block posts from this user</Text>
        </MenuOption>
        {(() => {
          if (postOwner) {
            return (        
            <MenuOption onSelect={updatePost} style={{ paddingVertical: 10 }}>
              <Text style={styles.text}>Update Post</Text>
            </MenuOption>);
          }
        })()}
        {(() => {
          if (postOwner) {
            return (        
            <MenuOption onSelect={deletePost} style={{ paddingVertical: 10 }}>
              <Text style={styles.text}>Delete Post</Text>
            </MenuOption>);
          }
        })()}
      </MenuOptions>
    </Menu>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor : "#00BCD4",
    backgroundColor: 'yellow',
    height: '20%',
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 80,
    marginLeft: 40,
  },
  text: {
    marginLeft: 30,
    color: 'black',
    fontSize: height * 0.019,
  },
});

const triggerStyles = {
  TriggerTouchableComponent: TouchableHighlight,
  triggerTouchable: {
    activeOpacity: 0.6,
    style: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
    },
  },
};

export default EllipsisMenu;
