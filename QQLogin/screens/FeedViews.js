import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Text, TouchableOpacity, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//Used for local storage to store JWTtoken
import AsyncStorage from '@react-native-async-storage/async-storage';

//Used to communicate with server
import { serverIp } from './Login.js';

var JWTtoken = ''; //Store JWT for authentication

// const homeposts = [
//   {
//     id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//     user: 'Blue Raccoon',
//     likes: '2',
//     body: 'This is a sample post!',
//   },
//   {
//     id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
//     user: 'Red Monkey',
//     likes: '12',
//     body: "Who's playing at Sun God today at 7pm?",
//   },
//   {
//     id: '58694a0f-3da1-471f-bd96-145571e29d72',
//     user: 'Purple Unicorn',
//     likes: '21',
//     body: 'Which dining hall has the best special today?',
//   },
//   {
//     id: '58894a0f-3da1-471f-bd96-145571e29d82',
//     user: 'Green Tortoise',
//     likes: '10',
//     body: 'Which dining hall has the best special today?',
//   },
//   {
//     id: '38bd68afc-c605-48d3-a4f8-fbd91aa97f63',
//     user: 'Pink Seahorse',
//     likes: '16',
//     body: 'What games do you all play?',
//   },
//   {
//     id: '20bd68afc-c605-48d3-a4f8-fbd91aa97f63',
//     user: 'Yellow Squirrel',
//     likes: '25',
//     body: 'Test post lol',
//   },
// ];

const allposts = [
  {
    post_id: '38bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    user_id: 'Pink Seahorse',
    likes: '16',
    post_text: 'What games do you all play?',
  },
  {
    post_id: '20bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    user_id: 'Yellow Squirrel',
    likes: '25',
    post_text: 'Test post lol',
  },
];

//Limits the number of lines and characters that can be shown on each of the post previews on the feed.
const AdjustTextPreview = ({ style, text }) => {
  return (
    <Text style={style} numberOfLines={2}>
      {text.length <= 88 ? `${text}` : `${text.substring(0, 85)}...`}
    </Text>
  );
};

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    {/* View for the text preview of each post as shown on the feed */}
    <View style={{ justifyContent: 'center', marginLeft: 25, marginRight: 25 }}>
      <AdjustTextPreview style={[styles.bodyText, textColor]} text={item.post_text} />
      {/* <Text style={[styles.bodyText, textColor]}>{item.post_text}</Text> */}
    </View>
    {/* The Data of each Post */}
    <View style={[styles.postTouchables, { backgroundColor: 'white' }]}>
      <View style={[styles.infoRow, { marginRight: 5 }]}>
        <MaterialCommunityIcons name="eye-outline" color="#BDBDBD" size={20} />
        <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 0 }]}>12</Text>
      </View>
      <View style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name="chevron-up" color="#BDBDBD" size={35} style={{ width: 29 }} />
        <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 0 }]}>21</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="chat-outline" color="#BDBDBD" size={20} />
        <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 0 }]}>{item.num_comments}</Text>
      </View>
      <View style={[styles.infoRow, { marginLeft: 10 }]}>
        <Text style={[styles.name, { color: '#BDBDBD', marginHorizontal: 0 }]}>Blue Raccoon</Text>
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={[styles.name, { color: '#BDBDBD', marginHorizontal: 0 }]}>{}8m ago</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const FirstRoute = () => {
  //useStates can only be defined within functions
  const [postData, setPostData] = useState([]); //Store post data from the Database
  const [postAge, setPostAge] = useState([]); //Stores the age of the post
  const [selectedId, setSelectedId] = useState(null); //Currently selected post (will highlight yellow)
  const [refresh, setRefresh] = useState(false); //Handle refreshing logic
  const [update, setUpdate] = useState(false); //Changing will feed to update
  const navigation = useNavigation();

  //renderItem function for each item passed through
  const renderItem = ({ item }) => {
    const backgroundColor = item.post_id === selectedId ? '#FFCC15' : '#FFFFFF';
    const color = item.post_id === selectedId ? 'white' : 'black';
    return (
      <Item
        //destructure the item
        item={item}
        //Functionality for when a post is pressed
        onPress={() => {
          setSelectedId(item.post_id);

          //navigate to post view page, sends through post information as parameter
          navigation.navigate('Post View', { post: item });
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  //Extracting the posts from the Database

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

  //Communicating with the database to get all the posts
  const getFromDB = async () => {
    await getJWT(); //gets JWTtoken from local storage and stores in JWTtoken

    try {
      // Gets all of the post information from the database for the feed
      const response = await fetch('http://' + serverIp + ':5000/feed/all-posts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: JWTtoken },
      });

      //The response includes post information, need in json format
      const parseRes = await response.json();

      console.log(JSON.stringify(parseRes));

      setPostData(parseRes.data.post);

      /*
       *"post":[
       * {"post_id":,
       * "user_id":,
       * "post_text":,
       * "num_comments":,
       * "time_posted":
       * */
      setPostAge(parseRes.data.postAge); //Post Age looks like "HH:MM:SS.mmmmmm"

      /* TODO: This could be done to turn into MM for screen
      postAge = postAge.toString();
      if (postAge.substring(0,1) == "00") {
        postAge = postAge.substring(3,4);
        if (postAge.charAt(0) == 0) {
          postAge = postAge.charAt(1);
        }
        postAgetext = postAge + "m";
      } else {
        postAge = postAge.substring(0,1);
        if (postAge.charAt(0) == 0) {
          postAge = postAge.charAt(1);
        }
        postAgetext = postAge + "h";
      }
      if ((postAgetext.charAt(postAge.length - 1) != 'h') || (postAgetext.charAt(postAge.length - 1) != 'm')) {
        console.error(error.message);
      }
      */
    } catch (error) {
      console.error(error.message);
    }
  };

  //useFocusEffect triggers works like useEffect, but only when this screen is focused
  // this lets us use navigation as the variable to track changes with, so feed updates
  // whenever the page is loaded
  useFocusEffect(
    React.useCallback(() => {
      getFromDB();
      console.log('Feed Refreshed');
      setRefresh(false); //End refresh animation
      setSelectedId(null); //reset Selected Id
    }, [navigation, update]),
  );

  //Handle the logic for what to do when flatlist is refreshed
  const handleRefresh = () => {
    setRefresh(true); //update animation
    setUpdate(!update); //Change variable to trigger useEffect to pull posts from database
  };

  return (
    // <StyledFeedContainer>
    //     <StatusBar style="black" />
    //     <InnerContainer/>
    <View style={{ backgroundColor: '#EFEFEF', paddingTop: 2.5 }}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={postData} /*postData to display*/
        age={postAge} //TODO: Is this Right?
        keyExtractor={(item) => item.post_id}
        extraData={selectedId}
        renderItem={renderItem}
        refreshing={refresh} //true: shows spinning animation to show loading
        onRefresh={handleRefresh} //When user refreshes by pulling down, what to do
      />
    </View>
    // </StyledFeedContainer>
  );
};

const SecondRoute = () => {
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();
  //renderItem function
  const renderItem = ({ item }) => {
    const backgroundColor = item.post_id === selectedId ? '#FFCC15' : '#FFFFFF';
    const color = item.post_id === selectedId ? 'white' : 'black';
    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.post_id);
          navigation.navigate('Post View', { post: item });
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  return (
    // <StyledFeedContainer style={{backgroundColor: 'pink'}}>
    //     <StatusBar style="black" />
    //     <InnerContainer/>
    <View style={{ backgroundColor: '#EFEFEF', paddingTop: 2.5 }}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={allposts}
        keyExtractor={(item) => item.post_id}
        extraData={selectedId}
        renderItem={renderItem}
      />
    </View>
    // </StyledFeedContainer>
  );
};

const initialLayout = { width: Dimensions.get('window').width };

const renderScene = SceneMap({
  home: FirstRoute,
  all: SecondRoute,
});

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: '#FFCC15' }}
    activeColor={'#FFCC15'}
    inactiveColor={'#BDBDBD'}
    style={{ backgroundColor: 'white' }}
  />
);

export default function FeedViews({ navigation }) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home' },
    { key: 'all', title: 'All' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={styles.container}
    />
  );
}

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    // marginTop: StatusBar.currentHeight,
    flex: 4,
    justifyContent: 'flex-start',
  },
  pageTitle: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  item: {
    // padding: 30,
    paddingTop: 30,
    // paddingHorizontal: 30,
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
  name: {
    fontSize: height * 0.02,
    fontWeight: '600',
    color: '#BDBDBD',
  },
  commentText: {
    fontSize: height * 0.02,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 20,
  },
  postTouchables: {
    // flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
    borderTopColor: '#EFEFEF',
    borderTopWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    //alignContent: 'space-around',
    alignItems: 'center',
    marginRight: 10,
  },
});
