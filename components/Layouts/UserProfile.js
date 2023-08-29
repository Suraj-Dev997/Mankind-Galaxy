import React ,{useState,useEffect}from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../Configuration/Config';

const UserProfile =  ({ isVisible, user, onClose, onLogout,route, }) => {
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
      const handleLogout = async () => {
        await AsyncStorage.removeItem('userdata');
        navigation.navigate('Login'); // replace 'Login' with the name of the screen you want to navigate to
      }
      

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userDetail}>{Des}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            {/* <Text style={styles.logoutButtonText} onPress={handleLogoutfunction}>Logout</Text> */}
            <Icon1 name="logout" size={30} color="#8B1874"  onPress={handleLogoutfunction}/>
          </TouchableOpacity>
        
          <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userDetail: {
    fontSize: 16,
    marginBottom: 16,
  },
  logoutButton: {
    
    paddingTop:5,
    paddingBottom:5,
    padding:5,
   
    
    borderRadius: 8,
  
    marginBottom: 16,
  },

  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // closeButton: {
  //   backgroundColor: 'blue',
  //   padding: 12,
  //   borderRadius: 8,
  //   alignItems: 'center',
  // },
  // closeButtonText: {
  //   color: 'white',
  //   fontWeight: 'bold',
  // },
});

export default UserProfile;
