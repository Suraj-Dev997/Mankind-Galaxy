import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../Configuration/Config';
import { format } from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';



const UpdateUserProfileForm = () => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [venue, setVenue] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);
  const [campDate, setCampDate] = useState();
  const [showCampDatePicker, setShowCampDatePicker] = useState(false);
  const [doctorDetail, setDoctorDetail] = useState(null);

  const route = useRoute();
  const navigation = useNavigation();
  const { doctorId,dc_id,id } = route.params;


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
              setName(doctorData.doctor_name);
              setVenue(doctorData.camp_venue);
              setCampDate(doctorData.camp_date);
              if (doctorData.doctor_img) {
                // Assuming that the API provides a valid image URL
                setAvatarUri(`${ProfileUrl}${doctorData.doctor_img}`);
                
              
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



  const EditDoctor = async () => {
    const { dc_id,id } = route.params;
  
    // Retrieve userId from AsyncStorage
    try {
      const data = await AsyncStorage.getItem('userdata');
      if (data) {
        const userData = JSON.parse(data);
        const userId = userData.responseData.user_id;
  
        // Continue with your FormData and API request
        try {
          const formData = new FormData();
          formData.append('doctor_id', doctorId);
          formData.append('dc_id', dc_id);
          formData.append('doctor_name', name);
          formData.append('user_id', userId); // Use the retrieved userId
          formData.append('camp_date', campDate);
          formData.append('camp_venue', venue);
  
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
    // <LinearGradient colors={['#72c5f8',  '#daf5ff']} style={styles.container} >
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
        <TextInput
          label="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          mode="outlined"
          style={styles.input}
          outlineColor="#0047b9"
          activeOutlineColor="#08a5d8"
        />

        <TextInput
          label="Venue"
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
          <Button style={styles.datePickerButton} onPress={showCampDate}>
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

       
        <LinearGradient colors={['#0047b9',  '#0c93d7']} style={styles.addbtn} >
        <Button
          // buttonColor="#0047b9"
          // mode="contained"
          onPress={EditDoctor}
          labelStyle={styles.addbtnText}
          >
          Submit
        </Button>
        </LinearGradient>
      </View>
    </View>
    // </LinearGradient>
    
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    flexDirection: 'column',
  },
  datePickerLabel: {
    fontSize: 14,
    marginBottom: 3,
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
    marginTop: 40,
    flex: 1,
  },
  input: {
    borderColor: 'blue',
    marginBottom: 12,
  },
  profileimg: {},
  button: {
    marginTop: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  changeAvatarText: {
    color: '#0047b9',
    textAlign: 'center',
  },
});

export default UpdateUserProfileForm;
