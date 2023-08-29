import React, { useState,useEffect } from 'react';
import { View, TouchableOpacity, Text,StyleSheet } from 'react-native';
import UserProfile from './UserProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../Configuration/Config';

const Ham = () => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [Des, setDes] = useState('');
  const [Sessionid, setSeesionid] = useState('');
  const [UserId, setUserId] = useState('');
    const [data, setData] = useState(null);
    const navigation = useNavigation();
   
    useEffect(() => {
      const getData = async () => {
        try {
          const jsonData = await AsyncStorage.getItem('userdata');
          if (jsonData !== null) {
            const data = JSON.parse(jsonData);
            setFullName(data.responseData.fullName);
            setDes(data.responseData.designation);
            setUserId(data.responseData.userId);
            setSeesionid(data.responseData.sessionId);
          }
        } catch (error) {
          console.log('Error retrieving data:', error);
        }
      };
      getData();
    }, []);
  
   

    const handleLogoutfunction = async () => {
      const ApiLogoutUrl = `${BASE_URL}${'/AccountApi/EndUserLoginSession'}`;
      const response = await fetch(ApiLogoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sessionId: Sessionid,
          userId: UserId
        }),
      });
      console.log('Session-id:',Sessionid)
      console.log('User-id:',UserId)
      const responseData = await response.json();
     
      if (response.ok) {
        // await AsyncStorage.setItem('user', "Suraj");
       
        console.log("Resopnse recived");
        try {
          await AsyncStorage.removeItem('userdata');
          setFullName("");
            setDes("");
            setUserId("");
            setSeesionid("");
          navigation.navigate('Login');
          console.log('Session End');
        } catch (error) {
          console.log('Error Session End:', error);
        }
        console.log(responseData.errorCode)
      } else {
        // errorMessage(responseData.error);
       
        console.log("F")
      }
      
    };

 

  const handleProfileIconPress = () => {
    setIsProfileModalVisible(!isProfileModalVisible);
  };

  const handleLogout = () => {
    // Handle logout logic here
    setIsProfileModalVisible(false);
  };

  return (
    <View style={[styles.container, {zIndex: 100}]}>
      {/* Render your hamburger icon here */}
      {/* <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}> */}
      <TouchableOpacity style={styles.logoutbt}>
      <Icon1 name="logout" size={27} color="#fff"  onPress={handleLogoutfunction}/>
      </TouchableOpacity>
      {isMenuOpen ? (
        <View style={[styles.menu, {zIndex: 100}]}>
          <Text>Suraj</Text>
          <TouchableOpacity >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <UserProfile
        isVisible={isProfileModalVisible}
        // user={user}
        onClose={handleProfileIconPress}
        onLogout={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoutbt:{
    padding:10,
    marginTop:8,
  },
    menu: {
        position: 'absolute',
        zIndex:999999999999,
        top: 5,
        right: 40,
        width:100,
        height:200,
        backgroundColor: 'white',
        padding: 10,
      },
    hamburgerIcon: {
      color:'#fff',
      fontSize: 30,
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    userDetail: {
      fontSize: 16,
      marginBottom: 20,
    },
    logoutButton: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
    },
    logoutButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    container: {
        position: 'absolute',
        top: -30,
        right: -20,
      },
  });
export default Ham;
