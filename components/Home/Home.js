
import React,{ useEffect,useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView,Linking,StatusBar,BackHandler,Alert  } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconA from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { BASE_URL } from '../Configuration/Config';


export const Home =  (props) =>{
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // Fetch categories from API here
    // For this example, let's assume the API returns an array of category objects
    const fetchedCategories = [
      { id: 1, name: 'Camp Poster' },
      { id: 2, name: 'Camp Report' },
      { id: 3, name: 'Dashboard' },
      // ... other categories
    ];
    setCategories(fetchedCategories);
  }, []);
//Version checking code-------------------------------------
  useEffect(() => {
    const ApiVersionUrl = `${BASE_URL}${'/AccountApi/GetLatestAppVersion'}`;
    const checkAppVersion = async () => {
      try {
           const response = await fetch(ApiVersionUrl, {
           method: 'GET',
           headers: {
          'Content-Type': 'application/json',
           },
        });
        const data = await response.json();
        const latestVersion = data.toString();
        console.log(latestVersion);
        // const currentVersion = DeviceInfo.getVersion(); // Replace with your current app version
        const currentVersion = '11' // Replace with your current app version
    
        
        console.log("Current b",currentVersion);
        console.log("Latest b",latestVersion);
        if (currentVersion !== latestVersion) {
          console.log("Current a",currentVersion);
          console.log("Latest a",latestVersion);
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to the latest version.',
            [
              {
                text: 'Update',
                onPress: () => {
                  // Replace the URL with your own update URL or the Play Store URL
                  Linking.openURL('https://play.google.com/store/apps/details?id=com.digiappnew');
                },
              },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.error('Error checking app version:', error);
        Alert.alert(
          'Error',
          'Failed to check the app version. Please try again later.'
        );
      }
    };
    checkAppVersion();
  }, []);
  //Version checking code-------------------------------------

  // let user = await AsyncStorage.getItem('user');  
  const checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('user');
    console.log(token)
    return token !== null;
  };
  useEffect(() => {
    const backAction =async () => {
      const usertoken= await AsyncStorage.getItem("userdata")
      if (!usertoken) {
        // If the user is not logged in, show an alert or perform any other action you want
        Alert.alert('Confirmation', 'Are you sure you want to exit the app?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
      } else {
        // If the user is logged in, prevent going back to the login screen
        return true;
      }
    };
  
    // Subscribe to the back button press event
    BackHandler.addEventListener('hardwareBackPress', backAction);
  
    // Cleanup the event listener when the component is unmounted
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

    return(
        <View style={styles.container}>
       
           <StatusBar backgroundColor="#0054a4"/>
          <View style={styles.container1}> 
        <View style={styles.container1} >    
        {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.button}
          onPress={() => props.navigation.navigate("HB")}
        >
          {/* <IconA name="antdesign" size={30} color="#fff" /> */}
          <Text style={styles.buttonText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
        </View>
          </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor:'#fff',
      flexGrow: 1,
      justifyContent: 'center',
      
    },
    container1: {
 width:'100%',
      padding: 10,
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    row: {
      flexDirection: 'row',
      marginBottom: 6,
    },
    button: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0054a4',
      padding: 10,
      marginVertical: 10,
      borderRadius: 5,
    },
    button1: {
      flex: 1,
      marginHorizontal: 3,
      height: 100,
      textAlign:'center',
      backgroundColor: 'gray',
      justifyContent: 'center',
      alignItems: 'center',
      // borderRadius:10,
 
    },
    image: {
      width: '100%',
      height: 140,
      // borderRadius:10,
      marginBottom:6,
    
    },
    buttonText: {
      marginTop:10,
      textAlign:'center',
      color: 'white',
      fontSize: 18,
     
    },
  });