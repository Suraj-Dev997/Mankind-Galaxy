import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text,Alert, ActivityIndicator,Image} from 'react-native';
import { BASE_URL } from '../Configuration/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axios} from 'axios';

export const Login = ({navigation }) =>{
   const [EmpCode, setEmpCode] = useState('');
  const [Password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
  setIsLoading(true);
  const ApiUrl = `${BASE_URL}${'/AccountApi/LoginValidate'}`;
  const response = await fetch(ApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      EmailId: null,
      EmpCode: EmpCode,
      Password: Password,
      IpAddress: "::1",
      UserDevice: null,
      UserBrowser: null,
      BrowserDetail: {},
      LoginTypeField: "EMPCODE",
      ClientId: "10001",
      DeptId: "1",
      UserId: null,
      CusQuizid: null
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
    if(responseData.errorCode=="1")
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
    Alert.alert('Error',responseData.error)
    console.log("F")
  }
  setIsLoading(false);
};
    return(
      <View style={styles.container}>
        {isLoading ? (
        <ActivityIndicator size="large" color="#0054a4" />
      ) : (
        <>
         <Image
        style={styles.logo}
        source={require('./Images/Logo.png')}
        resizeMode="contain"
      />
       <TextInput
        style={styles.input}
        placeholder="Employee Code"
        placeholderTextColor="#999999"
        onChangeText={(text) => setEmpCode(text)}
        value={EmpCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999999"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={Password}
      />
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}  onPress={handleLogin}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotPasswordContainer}>
        {/* <Text style={styles.forgotPasswordText}>Forgot Password?</Text> */}
      </TouchableOpacity>
      </>
       )}
    </View>
    );
  };

  
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#d4d4d2',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    // width: '40%',
    paddingTop:10,
    paddingBottom:10,
    padding:20,
    // height: 50,
    backgroundColor: '#0054a4',
    borderRadius: 5,
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
    color: '#0054a4',
    fontSize: 14,
  },
  logo:{
    width:"100%",
    height:100,
    marginBottom:50,
    borderRadius:50,

  }
});