import React, { useState, Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements';

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//formik
import { Formik } from 'formik';

//icons

import { Ionicons } from '@expo/vector-icons';

import {
  StyledViewPostContainer,
  PageLogo,
  PageTitleFlag,
  SubTitle,
  StyledFormArea,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  RightIcon,
  Colors,
  ButtonText,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  ExtraViewRight,
  StyledPostArea,
  StyledPostInput,
  PageTitlePost,
  InnerPostContainer,
  ExtraPostView,
  TextPostContent,
  ExtraBackView,
  TagDropdown,
  StyledPostArea1,
  StyledPostArea2,
} from './../components/styles';
import { Button, View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KBWrapper';
import { Picker } from '@react-native-picker/picker';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const FlagPost = ({ route, navigation }) => {
  // Use State hooks
  const [composePost, setComposePost] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedValue, setSelectedValue] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);

  const { post, user } = route.params;

  //Hooks and initial states for the Selectors
  const [checkboxState, setCheckboxState] = useState([
    { label: 'Bullying / Harassment', value: 'harassment', checked: false },
    { label: 'Inappropriate Content', value: 'inappropriate', checked: false },
    { label: 'Discrimination / Hate Speech', value: 'hate', checked: false },
    { label: 'Invasion of Privacy', value: 'privacy', checked: false },
    { label: 'Trolling', value: 'trolling', checked: false },
    { label: 'Spam', value: 'spam', checked: false },
    { label: 'Other', value: 'other', checked: false },
  ]);

  //Getting user input
  const [inputs, setInputs] = useState({
    //Values needed to create post (../server/routes/feed.js)
    //postTitle: '',
    postText: '',
    //author_id: '',
    postTag: 'Revelle' /*Initialize as first value in tags drop-down*/,
  });

  var JWTtoken = '';

  //Stores values to update input fields from user
  //const { postTitle, postText, author_id, postTag } = inputs;
  const { postText, postTag } = inputs;

  //Update inputs when user enters new ones, name is identifier, value as a string
  const onChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  //Executes when Post is pressed, sends post information to the database
  const onPressButton = async (e) => {
    e.preventDefault();
    sendToDB(inputs);
    navigation.pop();
    //not sure if modal will handle this navigation below, try later
    //navigation.navigate('TabNav', { Screen: 'Feed' });
  };

  //Getting JWT from local storage, must exist otherwise user can't be on this page
  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('token').then((token) => {
        // console.log('Retrieved Token: ' + token);
        JWTtoken = token;
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  //communicate registration information with the database
  const sendToDB = async (body) => {
    await getJWT();
    //body.author_id = JWTtoken; //Temp set to JWTtoken, change later maybe?

    // console.log('Inputs: ' + JSON.stringify(inputs));

    try {
      // console.log('Sent Token:      ' + JWTtoken);
      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + '/feed/create-post', {
        method: 'POST',
        headers: { token: JWTtoken, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      console.log(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Function to handle the checked state of Selectors
  const selectorHandler = (value, index) => {
    const newValue = checkboxState.map((selector, i) => {
      if (i !== index)
        return {
          ...selector,
          checked: false,
        };
      if (i === index) {
        const item = {
          ...selector,
          checked: !selector.checked,
        };
        return item;
      }
      return selector;
    });
    setCheckboxState(newValue);
  };

  return (
    <Modal
      transparent={true}
      statusBarTranslucent={false}
      visible={modalOpen}
      animationType="slide"
      onRequestClose={() => navigation.pop()}
    >
      <StyledViewPostContainer>
        <StatusBar style="black" />

        {/* Back Button */}
        <TextLink onPress={() => navigation.pop()} style={{ marginLeft: 10, width: 55, paddingHorizontal: 5 }}>
          <TextPostContent>Back</TextPostContent>
        </TextLink>

        {/* Flag as Inappropriate Title, with the Flag button across from it */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 45,
            width: '100%',
            alignContent: 'space-between',
            paddingBottom: 20,
          }}
        >
          <PageTitleFlag style={{ marginLeft: 15, fontSize: 22 }}>Flag as inappropriate?</PageTitleFlag>
          <TouchableOpacity onPress={onPressButton} style={{ marginLeft: 115 }}>
            <TextPostContent>Flag</TextPostContent>
          </TouchableOpacity>
        </View>

        {/* Section/Container for Anonymous Username */}
        <View style={{ backgroundColor: 'white', paddingVertical: 15, borderTopColor: '#DADADA', borderTopWidth: 1 }}>
          <Text style={{ marginLeft: 15, color: 'black', fontSize: 14 }}>{user}</Text>
        </View>

        {/* Section/Container for Text in the Post/Comment to be reported */}
        <View style={{ backgroundColor: 'white', paddingVertical: 15, borderTopColor: '#DADADA', borderTopWidth: 1 }}>
          <Text style={{ marginLeft: 15, color: 'black', fontSize: 14 }} numberOfLines={1}>
            {post}
          </Text>
        </View>

        {/* Section to separate Post/Comment data from Selectors */}
        <View style={{ backgroundColor: '#DADADA', paddingVertical: 15, borderTopColor: '#DADADA' }}>
          <Text style={{ marginLeft: 15, color: 'black', fontSize: 14 }}>This post falls under:</Text>
        </View>

        {/* Renders the different Flag Selection Choices (selectors/checkboxes) */}
        {checkboxState.map((selector, i) => (
          <View style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }} key={i}>
            <CheckBox
              onPress={() => selectorHandler(true, i)}
              title={selector.label}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={selector.checked}
              checkedColor={'#FFCC15'}
              containerStyle={{ backgroundColor: 'white', paddingVertical: 14, borderWidth: 0, borderColor: 'white' }}
              textStyle={{ color: 'black', fontSize: 14, fontWeight: 'normal' }}
            />
          </View>
        ))}

        {/* Bottom line divider (styling purposes) */}
        <View style={{ backgroundColor: 'white', borderTopColor: '#DADADA', borderTopWidth: 1 }} />
      </StyledViewPostContainer>
    </Modal>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <StyledInputLabel> {label} </StyledInputLabel>
      <StyledPostInput {...props} />
      {isPassword && (
        <RightIcon
          onPress={() => {
            setHidePassword(!hidePassword);
          }}
        >
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkgray} />
        </RightIcon>
      )}
    </View>
  );
};

export default FlagPost;
