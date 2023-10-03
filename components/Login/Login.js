import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text,Alert, ActivityIndicator,Image,ImageBackground} from 'react-native';
import { BASE_URL } from '../Configuration/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axios} from 'axios';
import LinearGradient from 'react-native-linear-gradient';

export const Login = ({navigation }) =>{
   const [EmpCode, setEmpCode] = useState('');
  const [Password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
  setIsLoading(true);
  const ApiUrl = `${BASE_URL}${'/auth/login'}`;
  const response = await fetch(ApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      empcode: EmpCode,
        password: Password
    
    }),
  });
  console.log(EmpCode)
  console.log(Password)
  const responseData = await response.json();
 
  if (response.ok) {
    // await AsyncStorage.setItem('user', "Suraj");
    const jsonData = JSON.stringify(responseData);
    console.log(jsonData);
    try {
      await AsyncStorage.setItem('userdata', jsonData);
      console.log('Data saved successfully');
      setEmpCode('')
      setPassword('')
    } catch (error) {
      console.log('Error saving data:', error);
    }
   
  
    // Alert.alert(user);  
   // const  isRemember=AsyncStorage.getItem('Name');
    //Alert.alert('Msg', isRemember);
    //console.log(isRemember);
    if(responseData.status=="SUCCESS")
    {
      navigation.navigate('Home');

    }else
    {
      Alert.alert('Error','Invalid EmployeeCode or Password')
     console.log(responseData.errorDetail)

    }

    console.log(responseData.errorCode)
   
  } else {
    // errorMessage(responseData.error);
    Alert.alert('Error','Error while Login')
    console.log("F")
  }
  setIsLoading(false);
};
    return(
      <ImageBackground
      source={require('./Images/Splash.jpg')}
      style={styles.backgroundImage}
    >
        {isLoading ? (
        <ActivityIndicator size="large" color="#0047b9" />
      ) : (
        <>
         <Image
        style={styles.logo}
        source={require('./Images/Logo.png')}
        resizeMode="contain"
      />
       <TextInput
        style={[styles.input]}
        placeholder="Employee Code"
        placeholderTextColor="#1c7cd8"
        onChangeText={(text) => setEmpCode(text)}
        value={EmpCode}
      />
      <TextInput
        style={[styles.input]}
        placeholder="Password"
        placeholderTextColor="#1c7cd8"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={Password}
      />
       <LinearGradient colors={['#0047b9',  '#0c93d7']} style={[styles.buttonContainer,styles.elevation]} >
       <TouchableOpacity  onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
       </LinearGradient>
     
      <TouchableOpacity style={styles.forgotPasswordContainer}>
      </TouchableOpacity>
      </>
       )}
    </ImageBackground>
    );
  };

  
  
const styles = StyleSheet.create({
  backgroundImage: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    resizeMode: 'cover', // or 'stretch' if you want the image to stretch to cover the entire screen
  },
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#F5F5F5',
  // },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    color:'#0047b9',
    borderColor: '#72c5f8',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    paddingTop:10,
    paddingBottom:10,
    padding:20,
    // height: 50,
    backgroundColor: '#0047b9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#0047b9',
    fontSize: 14,
  },
  logo:{
    width:"80%",
    height:100,
    marginBottom:50,
    borderRadius:50,

  },
  elevation: {
    elevation: 3,
    shadowColor: '#272626',
  },
});