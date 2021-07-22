import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
<<<<<<< HEAD
//import { AsyncStorage } from '@react-native-async-storage/async-storage';
=======
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> main

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

<<<<<<< HEAD
//used for testing, hardcoded token value
const JWTtoken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiODcyZGE5ZmEtMzg2MC00MzUxLTk3MGItMzc1ZjhkMjE0N2FmIiwiaWF0IjoxNjI2NzU5NjU0LCJleHAiOjE2MjY3NjMyNTR9.sPofEfhjuk8aFRh7GucfFXFZMy-hoXWCtiPeTvRGJdE';

=======
>>>>>>> main
//formik
import { Formik, Field, Form } from 'formik';

//icons

import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

import {
  StyledContainer,
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

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const CreatePost = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [agree, setAgree] = useState(false);

<<<<<<< HEAD
  /*Getting JWT from local storage, must exist otherwise user can't be on this page
  *****Local storage still needs to be set up*********
  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('token').then((token) => {
        console.log(token);
        return token;
=======
  var JWTtoken = '';

  //Getting JWT from local storage, must exist otherwise user can't be on this page

  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('token').then((token) => {
        // console.log('Retrieved Token: ' + token);
        JWTtoken = token;
>>>>>>> main
      });
    } catch (error) {
      console.error(error.message);
    }
  };
<<<<<<< HEAD
  */
  //communicate registration information with the database
  const sendToDB = async (body) => {
    try {
=======

  //communicate registration information with the database
  const sendToDB = async (body) => {
    await getJWT();
    try {
      //console.log('Sent Token:      ' + JWTtoken);
>>>>>>> main
      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + ':5000/feed/create-post', {
        method: 'POST',
        headers: { token: JWTtoken },
        body: JSON.stringify(body),
      });

      const parseRes = await response.text();

      console.log(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="black" />
        <InnerContainer>
          <PageTitle>New Post</PageTitle>

          <SubTitle></SubTitle>
          <Formik
            initialValues={{
<<<<<<< HEAD
              //hardcoded for now
              token: '',
              postTitle: '', //using for postId for now
              postText: '',
              authorId: '',
              postId: '',
              user: '',
=======
              postText: '',
              postId: '',
>>>>>>> main
            }}
            onSubmit={(values) => {
              //Setting up information to send to database
              body = {
<<<<<<< HEAD
                token: JSON.stringify(JWTtoken),
                postTitle: values.postTitle,
                postText: values.postText,
                authorId: values.authorId,
                postId: values.postId,
              };

              console.log(body.token);
              sendToDB(body);
=======
                postText: 'Title: ' + values.postText + 'Content: ' + values.postTitle,
                postId: values.postId,
              };

              sendToDB(body);
              navigation.navigate('PostView');
>>>>>>> main
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
<<<<<<< HEAD
                {/* might need to separate name into first and last name, add additional fields */}
=======
>>>>>>> main
                <MyTextInput
                  label=""
                  icon=""
                  placeholder="Post Title"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('postTitle')}
                  onBlur={handleBlur('postTitle')}
<<<<<<< HEAD
                  value={values.firstName}
=======
                  value={values.postTitle}
>>>>>>> main
                  selectionColor="#FFCC15"
                />

                <MyTextInput
                  label=""
                  icon=""
                  placeholder="Post Text"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('postText')}
                  onBlur={handleBlur('postText')}
<<<<<<< HEAD
                  value={values.lastName}
=======
                  value={values.postText}
>>>>>>> main
                  selectionColor="#FFCC15"
                />

                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Create Post</ButtonText>
                </StyledButton>
<<<<<<< HEAD
                <StyledButton onPress={() => navigation.navigate('Feed')}>
=======
                <StyledButton onPress={() => navigation.navigate('Login')}>
>>>>>>> main
                  <ButtonText>Back</ButtonText>
                </StyledButton>
                <Line />
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <StyledInputLabel> {label} </StyledInputLabel>
      <StyledTextInput {...props} />
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

export default CreatePost;
