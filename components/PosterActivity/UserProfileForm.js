import React, { useState,useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import { TextInput, Button, Avatar,Menu, Divider } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../Configuration/Config';
import { format } from 'date-fns';

const UserProfileForm = () => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [venue, setVenue] = useState('');
  const [avatarUri, setAvatarUri] = useState(null); // To store the URI of the selected image
  const [campDate, setCampDate] = useState(new Date());
  const [showCampDatePicker, setShowCampDatePicker] = useState(false);


  const [textInputValue, setTextInputValue] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const showDropdown = () => setDropdownVisible(true);
  const hideDropdown = () => setDropdownVisible(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  // console.log("this is sub id",id)


  useEffect(() => {
    const getData = async () => {
      try {
        const jsonData = await AsyncStorage.getItem('userdata');
        if (jsonData !== null) {
          const data = JSON.parse(jsonData);
          const userId = data.responseData.user_id;
          console.log(userId)
          setUserId(userId)
        }
      } catch (error) {
        console.log('Error retrieving data:', error);
      }
    };
    getData();
  }, []);

  const AddDoctor = async () => {
    const { id } = route.params;
    try {
      const formData = new FormData();
      formData.append('user_id', userId); // Replace with the actual user ID
      formData.append('subcat_id', id); // Replace with the actual subcategory ID
      formData.append('doctorName', name);
      const formattedCampDate = format(campDate, 'dd-MM-yyyy');
      formData.append('campDate', formattedCampDate); // Convert date to ISO format
      formData.append('campVenue', venue);
      console.log(formData)
      if (avatarUri) {
        const image = {
          uri: avatarUri,
          type: 'image/jpeg', // Adjust the image type as needed
          name: 'profile.jpg', // Provide a suitable name for the image
        };
        formData.append('image', image);
      }
      console.log(formData)

      const ApiUrl = `${BASE_URL}${'/doc/addDoctor'}`;
      const response = await fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response:', data);
        Alert.alert(
          'Success',
          'Doctor added successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to the home screen after pressing OK
                // navigation.navigate('PosterList',id);
                navigation.goBack();
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.error('Error uploading data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    hideDropdown();
  };
  const dropdownItems = ['Option 1', 'Option 2', 'Option 3'];
  
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

  return (
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
              source={require('./Images/Profile.jpg')} // Replace with your default avatar image
              size={100}
              style={styles.profileimg}
            />
          )}
        </View>
        <Text style={styles.changeAvatarText}>Upload Profile Image</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          mode="outlined"
          style={styles.input}
          outlineColor='#0054a4'
          activeOutlineColor='#08a5d8'
        />

        <TextInput
          label="Venue"
          value={venue}
          onChangeText={(text) => setVenue(text)}
          mode="outlined"
          style={styles.input}
          outlineColor='#0054a4'
          activeOutlineColor='#08a5d8'
        />

<View style={styles.datePickerContainer} >
    
    <Text style={styles.datePickerLabel} onPress={showCampDate}>Select Date:</Text>
    <Button style={styles.datePickerButton} onPress={showCampDate}>
  {campDate.getDate().toString().padStart(2, '0')}-
  {(campDate.getMonth() + 1).toString().padStart(2, '0')}-
  {campDate.getFullYear()}
</Button>
    {showCampDatePicker && (
      <DateTimePicker
        value={campDate}
        mode="date"
        is24Hour={true}
        display="default"
        dateFormat='DD-MM-YYYY'
        onChange={handleCampDateChange}
      />
    )}
  </View>

  

        <Button
        buttonColor='#0054a4'
          mode="contained"
          onPress={AddDoctor}
          style={styles.button}
        >
          Submit
        </Button>
      </View>
    </View>

     

  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    flexDirection: 'column',
// alignItems:'center'
 
  
  },
  datePickerLabel: {
    fontSize: 14, // You can adjust the font size as needed
    marginBottom: 3, // Spacing between label and button
    color:'#0054a4',
    fontWeight:'600',
   
  },
  datePickerButton: {
    width:'auto',
    borderRadius:5,
    textAlign:'left',
    alignItems:'flex-start',
    fontSize: 16, // You can adjust the font size as needed
    backgroundColor:'#fff',
    borderWidth: 1,
    borderColor: '#0054a4',
    padding:5,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  form: {
    marginTop:40,
    flex: 1,
  },
  input: {
    borderColor: 'blue',
    marginBottom: 12,
  },
  profileimg:{

  },
  button: {
 
    marginTop: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  changeAvatarText: {
    color: '#0054a4',
    textAlign: 'center',
  },
});

export default UserProfileForm;
