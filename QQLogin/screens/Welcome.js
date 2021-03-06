import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
//formik
import { Formik, Field, Form } from 'formik';
//search bar
import { SearchBar } from 'react-native-elements';

//icons

import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

import {
  StyledContainer,
  StyledFeedContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  RightIcon,
  Colors,
  ButtonText,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  ExtraViewRight,
} from './../components/styles';

import { Button, View } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KBWrapper';

import CreatePost from '../screens/CreatePost';
import FeedViews from './FeedViews';
import PostMenu from '../components/PostMenu.js';
//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

// const {data} = parseRes
// const {post} = data
/* Object {
  "data": Object {
    "post": Array [
      Object {
        "post_id": "13",
        "post_text": "This is a test for rendering the all feed.",
        "time_posted": "2021-07-21T20:28:26.689Z",
        "user_id": "b1e0c14e-3836-4f34-8616-9b637a5da497",
      },
      Object {
        "post_id": "14",
        "post_text": "This is another 2nd test for rendering the all feed.",
        "time_posted": "2021-07-21T20:31:27.131Z",
        "user_id": "b1e0c14e-3836-4f34-8616-9b637a5da497",
      },
      Object {
        "post_id": "15",
        "post_text": "More posts and stuff. it is 1:31 PM on 7/21.",
        "time_posted": "2021-07-21T20:31:51.337Z",
        "user_id": "b1e0c14e-3836-4f34-8616-9b637a5da497",
      },
      Object {
        "post_id": "16",
        "post_text": "Empty Post",
        "time_posted": "2021-07-21T20:32:05.899Z",
        "user_id": "b1e0c14e-3836-4f34-8616-9b637a5da497",
      },
      Object {
        "post_id": "17",
        "post_text": "",
        "time_posted": "2021-07-21T20:32:14.906Z",
        "user_id": "b1e0c14e-3836-4f34-8616-9b637a5da497",
      },
    ],
  },
  "postCount": 5,
} */

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    {/* <Text style={[styles.title, textColor]}>{item.title}</Text> */}
    <Text style={[styles.bodyText, textColor]}>{item.post_text}</Text>
  </TouchableOpacity>
);

const Welcome = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);

  const [agree, setAgree] = useState(false);

  const checkboxHandler = () => {
    setAgree(!agree);
  };
  const btnHandler = () => {
    alert('pog');
  };

  // const updateSearch = (search) => {
  //   setState({search});
  // };

  const [selectedId, setSelectedId] = useState(null);

  // renderItem function, not needed rn, too scared to delete it
  // const renderItem = ({ item }) => {
  //   const backgroundColor = item.post_id === selectedId ? '#FFCC15' : '#FFFFFF';
  //   const color = item.post_id === selectedId ? 'white' : 'black';

  //   return (
  //     <Item
  //       item={item}
  //       onPress={() => {
  //         setSelectedId(item.id);
  //         navigation.navigate('Post View');
  //       }}
  //       backgroundColor={{ backgroundColor }}
  //       textColor={{ color }}
  //     />
  //   );
  // };

  return (
    <StyledFeedContainer>
      <StatusBar style="black" />
      <InnerContainer>
        {/* <PageLogo resizeMode = 'contain' source={require('./../assets/login.png')} />
         */}
        {/* <PageTitle>Feed</PageTitle> */}
        <Text style={styles.pageTitle}>Feed</Text>
        <SearchBar
          placeholder="Search Tags"
          // onChangeText={this.updateSearch}
          lightTheme="true"
          containerStyle={{
            width: '90%',
            height: height * 0.07,
            alignItems: 'center',
            marginTop: height * 0.02,
            borderRadius: 100,
            backgroundColor: '#F2F2F2',
          }}
          inputContainerStyle={{ borderRadius: 100, height: '100%', width: '100%', backgroundColor: '#F9F9F9' }}
        />
      </InnerContainer>

      <FeedViews navigation={navigation} />

      {/* <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate('Create Post')}
        style={styles.touchableStyle}
      >
        <Image source={require('./../assets/create_post_button.png')} style={styles.floatingButtonStyle} />
      </TouchableOpacity> */}

      <PostMenu navigation={navigation} />
    </StyledFeedContainer>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  item: {
    // padding: 30,
    paddingHorizontal: 30,
    marginVertical: 2.5,
    //marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  touchableStyle: {
    position: 'absolute',
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: width * 0.18,
    height: width * 0.18,
  },
});

export default Welcome;
