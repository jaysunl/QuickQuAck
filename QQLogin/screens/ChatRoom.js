import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';


import { GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
import { FontAwesome } from '@expo/vector-icons';

import {
  StyledViewPostContainer,
 } from './../components/styles';

 import ChatRoomEllipsis from '../components/ChatRoomEllipsis';

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//Store Authentication Token
var JWTtoken = '';

//formik
import { Formik, Field, Form } from 'formik';

//icons
import { MaterialCommunityIcons, EvilIcons, Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

const ChatRoom = ({route}) => {
    const user = route.params.user;
    const avatarColor = route.params.avatarColor;
    const navigation = useNavigation();

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello there!',
                createdAt: new Date(),
                user: {
                _id: 2,
                name: user,
                avatar: true,
                },
            },
            {
                _id: 2,
                text: 'Hello world',
                createdAt: new Date(),
                user: {
                _id: 1,
                name: 'Me',
                avatar: true,
                },
            },
        ]);
    }, []);


    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages),
        );
    }, []);

    // Function that customizes the send component
    const renderSend = (props) => {
        return (
            <Send {...props} containerStyle={{marginBottom: 5, marginRight: 5, width: 35, height: 35}}>
                <View>
                    <MaterialCommunityIcons
                    name="arrow-up-circle"
                    style={{}}
                    size={34}
                    color="#FFCC15"
                    />
                </View>
            </Send>
        );
    };

    // Function that takes care of what each chat bubble looks like
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#FFCC15',
                    },
                }}
                textStyle={{
                    right: {
                        color: '#fff',
                    },
                }}
            />
        );
    };

    //Function to render how the input box for the text will look.
    //Current issue: having too many lines will make the inputbox look messed up
    const renderInputToolbar = (props) => {
        return(
            <InputToolbar {...props} 
            containerStyle={{paddingVertical: 8, borderTopColor: 'white', justifyContent: 'center'}} 
            primaryStyle={{backgroundColor: '#F6F6F6', borderRadius: 100, borderWidth: 1, borderColor: '#E8E8E8', width: '90%', alignSelf: 'center', justifyContent: 'center'}}
            accessoryStyle={{backgroundColor: 'dodgerblue',}}/>
        );
    }

    // Function to render what the other user's avatar looks like (set to just the color of the user for now)
    const renderAvatar = ({props}) => {
        const backgroundColor = avatarColor;
        return(
            <View style={[{justifyContent: 'center', width: 45, height: 45, borderRadius: 45, backgroundColor: backgroundColor, borderColor: '#E8E8E8', borderWidth: 1}]}/>
        );
    }

    // Function that customizes the scroll-to-bottom button/component
    const scrollToBottomComponent = () => {
        return(
            <FontAwesome name='arrow-down' size={22} color='#333' />
        );
    }

    return(
        <StyledViewPostContainer>
            <StatusBar style="black" />

            {/* Container for Upper Portion of the Chat Room Screen: Name of other User, back button, ... button */}
            <View style={styles.screenHeader}>
                <TouchableOpacity onPress={() => navigation.navigate('Messages')} >
                    <Text style={{color:'#FFCC15', fontSize: 18}}>Back</Text>
                </TouchableOpacity>
                <Text style={[styles.pageTitle]}>{user}</Text>
                <View>
                    <ChatRoomEllipsis navigation={navigation} />
                </View>
            </View>

            {/* Rest of the Screen for the Chat */}
            <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{_id: 1,}}
            renderBubble={renderBubble}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
            placeholder="Message here..."
            // renderInputToolbar={renderInputToolbar}
            minInputToolbarHeight={60}
            renderAvatar={renderAvatar}
            />
            
        </StyledViewPostContainer>
    );
    
    
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  screenHeader: {
      alignItems: 'center', 
      paddingHorizontal: 15, 
      paddingTop: 10, 
      paddingBottom: 25, 
      borderBottomWidth: 1, 
      borderBottomColor: '#DADADA', 
      flexDirection: 'row', 
      justifyContent:'space-between'
  }
});

export default ChatRoom;