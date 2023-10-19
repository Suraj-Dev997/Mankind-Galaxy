import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,Alert,FlatList,ActivityIndicator } from 'react-native';
import { TextInput, Button, Avatar,DefaultTheme } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../Configuration/Config';
import { format } from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const UpdateUserProfileForm = () => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [venue, setVenue] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);
  const [campDate, setCampDate] = useState();
  const [showCampDatePicker, setShowCampDatePicker] = useState(false);
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [doctorNames, setDoctorNames] = useState([]);
  const [textInputValue, setTextInputValue] = useState('');
  const [filteredDoctorNames, setFilteredDoctorNames] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
const [imgName,setImgName]= useState();
  const [selectedTime, setSelectedTime] = useState();

  const route = useRoute();
  const navigation = useNavigation();
  const { doctorId,dc_id,id } = route.params;


  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  function getCurrentTime() {
    const currentTime = new Date();
    return currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  const handleTimeConfirm = (time) => {
    const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setSelectedTime(formattedTime);
    console.log('Time is',formattedTime)
    hideTimePicker();
  };

  useEffect(() => {
    // Fetch doctor names from the API
    const ApiUrl = `${BASE_URL}${'/doc/getDoctorWithUserId'}`;
    
    // Fetch the userId from AsyncStorage
    AsyncStorage.getItem('userdata')
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data);
          const userId = userData.responseData.user_id;
          
          // Call fetchData with the retrieved userId
          console.log("Getting user id:", userId);
          
          // Fetch data using the retrieved userId
          return fetch(ApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId, // Use the retrieved userId here
              subCatId: id,
            }),
          });
        } else {
          console.error('Invalid or missing data in AsyncStorage');
        }
      })
      .then((response) => {
        if (!response) {
          return; // Return early if there was an issue with AsyncStorage
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Extract doctor names from the response
          console.log(data)
          const names = data.map((doctor) => doctor.doctor_name);
          setDoctorNames(names);
          console.log(names);
        }
      })
      .catch((error) => {
        console.error('Error fetching doctor names:', error);
      });
  }, [id]);

  useEffect(() => {
    const handleMoreInfo = async(doctor) => {
       
        try {
        
          const payload ={
            doctorId:doctorId,
            dcId:dc_id
          }
          const ApiUrl = `${BASE_URL}${'/doc/getDoctorPoster'}`;
          const ProfileUrl = `${BASE_URL}${'/uploads/profile/'}`;
          const response = await fetch(ApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          if (response.ok) {
            const data = await response.json();
            // console.log('API Response:', data);
            if (Array.isArray(data) && data.length > 0) {
              const doctorData = data[0];
              setTextInputValue(doctorData.doctor_name);
              setVenue(doctorData.camp_venue);
              setCampDate(doctorData.camp_date);
              setSelectedTime(doctorData.camp_time);
              if (doctorData.doctor_img) {
                // Assuming that the API provides a valid image URL
                setAvatarUri(`${ProfileUrl}${doctorData.doctor_img}`);
                setImgName(doctorData.doctor_img)
                console.log("Img name:",doctorData.doctor_img);
                
              
              }
            }
          } else {
            console.error('Error fetching doctor data:', response.statusText);
          }
        } catch (error) {
          console.log('Error saving data:', error);
        }
       
     
       
      }
    handleMoreInfo();
  }, [doctorId,dc_id]);
  
  useEffect(()=>{
    // console.log(doctorDetail)
    if(doctorDetail){
      setName(doctorDetail.doctor_name)
    //    console.log(doctorDetail)
      setVenue(doctorDetail.camp_venue)
     
    }

  },[doctorDetail])

  const handleTextInputChange = (text) => {
    setTextInputValue(text);
    // Filter the doctor names based on user input
    const filteredNames = doctorNames.filter((name) =>
      name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDoctorNames(filteredNames);
    setIsDropdownVisible(!!text); // Hide the dropdown if text is empty
  };
  const handleDoctorSelect = (name) => {
    setSelectedDoctor(name);
    setTextInputValue(name);
    setIsDropdownVisible(false);
  };
  const addPoster = async () => {
    try {
      const ApiUrl = `${BASE_URL}${'/addPoster'}`;
      const response = await fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId:doctorId,
          dcId:dc_id,
          subCatId:id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Poster Updated successfully:', data);
      } else {
        const data = await response.json();
        console.log('Error Updating poster:', data);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const EditDoctor = async () => {
    const { dc_id,id } = route.params;
  
    // Retrieve userId from AsyncStorage
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('userdata');
      if (data) {
        const userData = JSON.parse(data);
        const userId = userData.responseData.user_id;
  
        // Continue with your FormData and API request
        try {
      
          const formData = new FormData();
          formData.append('doctor_id', doctorId);
          formData.append('dc_id', dc_id);
          formData.append('doctor_name', textInputValue);
          formData.append('user_id', userId); // Use the retrieved userId
          formData.append('camp_date', campDate);
          formData.append('camp_venue', venue);
          formData.append('camp_time', selectedTime);
          formData.append('doctor_img', imgName);
          if (avatarUri) {
            const image = {
              uri: avatarUri,
              type: 'image/jpeg',
              name: 'profile.jpg',
            };
            formData.append('image', image);
          }
          console.log(formData);
          const ApiUrl = `${BASE_URL}${'/doc/updateDoctor'}`;
          const response = await fetch(ApiUrl, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
  
          if (response.ok) {
            const responseData = await response.json();
            console.log('Response:', responseData);
            Alert.alert(
              'Success',
              'Doctor updated successfully',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    addPoster();
                    navigation.goBack(); // Navigate to PosterList with the id
                  },
                },
              ],
              { cancelable: false }
            );
          } else {
            console.error('Error uploading data:', response);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        console.error('Invalid or missing data in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }finally {
      setLoading(false); // Stop loading, whether successful or not
    }
  };
  
  const handleCampDateChange = (event, selectedDate) => {
    setShowCampDatePicker(false);
    if (selectedDate) {
      // Parse the date string in "dd-mm-yyyy" format to create a new Date object
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const newDate = new Date(year, month - 1, day); // Month is 0-indexed
  
      setCampDate(newDate);
    }
  };

  const showCampDate = () => {
    setShowCampDatePicker(true);
  };

  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 200, // Maximum width for the selected image
      height: 200, // Maximum height for the selected image
      cropping: true, // Enable image cropping
    })
      .then((image) => {
        // Set the URI of the selected and cropped image
        setAvatarUri(image.path);
        console.log(image);
        console.log(image.path);
      })
      .catch((error) => {
        if (error.message === 'User cancelled image selection') {
          // User cancelled image selection, do nothing or show a message
          console.log('Image selection cancelled by the user');
        } else {
          // Handle other errors
          console.error('Error selecting image:', error);
        }
      });
  };

  const handleSubmit = async () => {
    // Implement your submit logic here
  };

  return (
    <LinearGradient colors={['#72c5f8',  '#daf5ff']} style={styles.container} >
      <View style={styles.container}>
      <TouchableOpacity onPress={chooseImage}>
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Avatar.Image
              source={{ uri: avatarUri }}
              size={100}
              style={styles.profileimg}
            />
          ) : (
            <Avatar.Image
              source={require('./Images/Profile.jpg')}
              size={100}
              style={styles.profileimg}
            />
          )}
        </View>
        <Text style={styles.changeAvatarText}>Update Profile Image</Text>
      </TouchableOpacity>

      <View style={styles.form}>
      <Text style={styles.datePickerLabel} >
      Name of Doctor
          </Text>
      <View style={styles.inputContainer}>
          <TextInput
            backgroundColor='#fff'
            underlineColor='#fff'
            style={styles.inputField}
            outlineColor='#0047b9'
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                primary: '#0047b9', // Change the label color to blue
              },
            }}
            activeOutlineColor='#08a5d8'
            value={textInputValue}
            onChangeText={handleTextInputChange}
            // label="Name of Doctor"
          />
          {isDropdownVisible && (
            <FlatList
              data={filteredDoctorNames}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDoctorSelect(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              style={styles.dropdownList}
            />
          )}
        </View>
        <Text style={styles.datePickerLabel} >
Venue
          </Text>
        <TextInput
          // label="Venue"
          value={venue}
          onChangeText={(text) => setVenue(text)}
          mode="outlined"
          style={styles.input}
          outlineColor="#0047b9"
          activeOutlineColor="#08a5d8"
        />

        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel} onPress={showCampDate}>
            Select Date:
          </Text>
          <Button style={styles.datePickerButton} onPress={showCampDate}  labelStyle={styles.addbtnText1}>
  {campDate}
</Button>
          {showCampDatePicker && (
            <DateTimePicker
              value={campDate}
              mode="date"
              is24Hour={true}
              display="default"
              dateFormat="DD-MM-YYYY"
              onChange={handleCampDateChange}
            />
          )}
        </View>


        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel} onPress={showTimePicker} >
            Select Time:
          </Text>
          <Button style={styles.datePickerButton} onPress={showTimePicker} 
          labelStyle={styles.addbtnText1}
          >
          {selectedTime}
          </Button>
          <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        is24Hour={false}
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
        </View>

       
        <LinearGradient colors={['#0047b9',  '#0c93d7']} style={styles.addbtn} >
        <Button
          // buttonColor="#0047b9"
          // mode="contained"
          onPress={EditDoctor}
          labelStyle={styles.addbtnText}
          >
         {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              'Submit'
            )}
        </Button>
        </LinearGradient>
      </View>
    </View>
  </LinearGradient>
    
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderColor: '#0047b9',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom:10,
    overflow: 'hidden',
    backgroundColor:'#fff',
  },
  inputField: {
    padding: 0,
    fontSize: 15,
  },
  dropdownList: {
    maxHeight: 150, // Set a max height for the dropdown list
    borderColor: '#ccc',
    backgroundColor:'#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addbtnText1: {
    color: '#474747', // Set the text color here
  },
  datePickerContainer: {
    flexDirection: 'column',
  },
  datePickerLabel: {
    fontSize: 14,
    marginBottom: 0,
    color: '#0047b9',
    fontWeight: '600',
  },
  addbtn: {
    backgroundColor: '#0047b9',
    paddingLeft: 1,
    paddingRight: 1,
    color: 'white',
    marginTop: 8,
    marginBottom: 10,
    borderRadius:50,
   
  },
  addbtn1: {
    
    color: '#fff',
    
  },
  addbtnText: {
    color: '#fff', // Set the text color here
  },
  datePickerButton: {
    width: 'auto',
    borderRadius: 5,
    textAlign: 'left',
    alignItems: 'flex-start',
    fontSize: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0047b9',
    padding: 5,
    marginBottom: 12,
  },
  container: {
    // backgroundColor:'#B9D9EB',
    flex: 1,
    padding: 16,
  },
  form: {
    marginTop: 10,
    flex: 1,
  },
  input: {
    borderColor: 'blue',
    marginBottom: 10,
  },
  profileimg: {},
  button: {
    marginTop: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  changeAvatarText: {
    color: '#0047b9',
    textAlign: 'center',
  },
});

export default UpdateUserProfileForm;
