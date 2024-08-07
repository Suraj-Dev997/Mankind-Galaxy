import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Button,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen'; 

export const SplashS = ({navigation}) => {
  // useEffect(() => {
  //   const getDeviceToken = async () => {
  //     try {
  //       const token = await messaging().getToken();
  //       console.log('token', token);
  //     } catch (error) {
  //       console.log('Error getting device token:', error);
  //     }
  //   };
  //   getDeviceToken();
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     handleUser();
  //   }, 5000);
  // });

  // eslint-disable-next-line react-hooks/exhaustive-deps
 
  useEffect(() => {
    const handleUser = async () => {
      const usertoken = await AsyncStorage.getItem('userdata');
      if (!usertoken) {
        navigation.replace('Login');
      } else {
        navigation.replace('Home');
      }
    };

    const timeout = setTimeout(() => {
      handleUser();
      SplashScreen.hide(); // Hide the splash screen
    }, 5000);

    // Clear the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, [navigation]); 




  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./Images/Splash.jpg')}
        style={styles.backgroundImage}></ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logo: {
    fontSize: 70,
    fontWeight: '800',
    color: '#0047b9',
  },
  img: {
    width: '100%',
  },
});
