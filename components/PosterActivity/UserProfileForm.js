import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import {TextInput, Button, Avatar, Menu, Divider,DefaultTheme} from 'react-native-paper';

import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL} from '../Configuration/Config';
import {format} from 'date-fns';
import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';

const UserProfileForm = () => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [venue, setVenue] = useState('');
  const [avatarUri, setAvatarUri] = useState(null); // To store the URI of the selected image
  const [campDate, setCampDate] = useState(new Date());
  const [showCampDatePicker, setShowCampDatePicker] = useState(false);
  const [doctorNames, setDoctorNames] = useState([]);
  const [textInputValue, setTextInputValue] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [filteredDoctorNames, setFilteredDoctorNames] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const showDropdown = () => setDropdownVisible(true);
  const hideDropdown = () => setDropdownVisible(false);
  const route = useRoute();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const {id} = route.params;
  // console.log("this is sub id",id)

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
    const getData = async () => {
      try {
        const jsonData = await AsyncStorage.getItem('userdata');
        if (jsonData !== null) {
          const data = JSON.parse(jsonData);
          const userId = data.responseData.user_id;
          console.log(userId);
          setUserId(userId);
        }
      } catch (error) {
        console.log('Error retrieving data:', error);
      }
    };
    getData();
  }, []);

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

  const addPoster = async (docId, dcId, subCatId) => {
    try {
      const ApiUrl = `${BASE_URL}${'/addPoster'}`;
      const response = await fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId,
          dcId,
          subCatId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Poster added successfully:', data);
      } else {
        const data = await response.json();
        console.log('Error adding poster:', data);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };
  const findDoctor = async () => {
     // Check if any required fields are empty
     if (!textInputValue || !campDate || !venue || !avatarUri) {
      // Display an alert message if any required fields are empty
      alert('Please fill in all required fields');
      return;
    }
    try {
      const ApiUrl = `${BASE_URL}${'/doc/findDoctorPresent'}`;
      const response = await fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorName: textInputValue,
        }),
      });

      const data = await response.json();

      if (data.errorCode === '1') {
        console.log('Doctor found');
        setModalVisible(true);
      } else {
        console.log('Doctor not found');
        handleNo();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleYes = async () => {
    setModalVisible(false);

    const {id} = route.params; // Make sure 'route' is accessible in this scope

    try {
      const formData = new FormData();
      formData.append('user_id', userId); // Replace with the actual user ID
      formData.append('subcat_id', id); // Replace with the actual subcategory ID
      formData.append('doctorName', textInputValue);
      const formattedCampDate = format(campDate, 'dd-MM-yyyy');
      formData.append('campDate', formattedCampDate); // Convert date to ISO format
      formData.append('campVenue', venue);
      console.log(formData);
      if (avatarUri) {
        const image = {
          uri: avatarUri,
          type: 'image/jpeg', // Adjust the image type as needed
          name: 'profile.jpg', // Provide a suitable name for the image
        };
        formData.append('image', image);
      }
      console.log(formData);

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

        if (data.errorCode === '1') {
          Alert.alert(
            'Success',
            'Doctor added successfully',
            [
              {
                text: 'OK',
                onPress: () => {
                  addPoster(data.docId, data.dcId, id); // Call addPoster function
                  navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          console.error('Error adding doctor:', data.message);
        }
      } else {
        console.error('Error uploading data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleNo = async () => {
    setModalVisible(false);

    const {id} = route.params; // Make sure 'route' is accessible in this scope

    try {
      const formData = new FormData();
      formData.append('user_id', userId); // Replace with the actual user ID
      formData.append('subcat_id', id); // Replace with the actual subcategory ID
      formData.append('doctorName', textInputValue);
      const formattedCampDate = format(campDate, 'dd-MM-yyyy');
      formData.append('campDate', formattedCampDate); // Convert date to ISO format
      formData.append('campVenue', venue);
      console.log(formData);
      if (avatarUri) {
        const image = {
          uri: avatarUri,
          type: 'image/jpeg', // Adjust the image type as needed
          name: 'profile.jpg', // Provide a suitable name for the image
        };
        formData.append('image', image);
      }
      console.log(formData);

      const ApiUrl = `${BASE_URL}${'/doc/addDoctorWithNormal'}`;
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

        if (data.errorCode === '1') {
          Alert.alert(
            'Success',
            'Doctor added successfully',
            [
              {
                text: 'OK',
                onPress: () => {
                  addPoster(data.docId, data.dcId, id); // Call addPoster function
                  navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          console.error('Error adding doctor:', data.message);
        }
      } else {
        console.error('Error uploading data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const AddDoctor = async () => {
    const {id} = route.params;
    try {
      const formData = new FormData();
      formData.append('user_id', userId); // Replace with the actual user ID
      formData.append('subcat_id', id); // Replace with the actual subcategory ID
      formData.append('doctorName', name);
      const formattedCampDate = format(campDate, 'dd-MM-yyyy');
      formData.append('campDate', formattedCampDate); // Convert date to ISO format
      formData.append('campVenue', venue);
      console.log(formData);
      if (avatarUri) {
        const image = {
          uri: avatarUri,
          type: 'image/jpeg', // Adjust the image type as needed
          name: 'profile.jpg', // Provide a suitable name for the image
        };
        formData.append('image', image);
      }
      console.log(formData);

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

        if (data.errorCode === '1') {
          Alert.alert(
            'Success',
            'Doctor added successfully',
            [
              {
                text: 'OK',
                onPress: () => {
                  addPoster(data.docId, data.dcId, id); // Call addPoster function
                  navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          console.error('Error adding doctor:', data.message);
        }
      } else {
        console.error('Error uploading data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleItemSelect = item => {
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
  const chooseImage = async () => {
    const cameraPermission = PERMISSIONS.ANDROID.CAMERA;
    const storagePermission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

    const cameraStatus = await check(cameraPermission);
    const storageStatus = await check(storagePermission);

    if (cameraStatus !== RESULTS.GRANTED) {
      const result = await request(cameraPermission);
      if (result !== RESULTS.GRANTED) {
        Alert.alert('Camera permission required');
        return;
      }
    }

    if (storageStatus !== RESULTS.GRANTED) {
      const result = await request(storagePermission);
      if (result !== RESULTS.GRANTED) {
        Alert.alert('Storage permission required');
        return;
      }
    }

    ImagePicker.openPicker({
      width: 200, // Maximum width for the selected image
      height: 200, // Maximum height for the selected image
      cropping: true, // Enable image cropping
    })
      .then(image => {
        // Set the URI of the selected and cropped image
        setAvatarUri(image.path);
        console.log(image);
        console.log(image.path);
      })
      .catch(error => {
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
    <LinearGradient colors={['#72c5f8',  '#daf5ff']} style={styles.container} >
       <View style={styles.container}>
      <TouchableOpacity onPress={chooseImage}>
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Avatar.Image
              source={{uri: avatarUri}}
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
            label="Name of Doctor"
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
        {/* <TextInput
          label="Name"
          value={name}
          onChangeText={text => setName(text)}
          mode="outlined"
          style={styles.input}
          outlineColor="#0047b9"
          activeOutlineColor="#08a5d8"
        /> */}

        <TextInput
          label="Venue"
          value={venue}
          onChangeText={text => setVenue(text)}
          mode="outlined"
          style={styles.input}
          outlineColor="#0047b9"
          activeOutlineColor="#08a5d8"
        />

        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel} onPress={showCampDate}>
            Select Date:
          </Text>
          <Button style={styles.datePickerButton} onPress={showCampDate}
          labelStyle={styles.addbtnText1}
          >
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
              dateFormat="DD-MM-YYYY"
              onChange={handleCampDateChange}
            />
          )}
        </View>
        <LinearGradient colors={['#0047b9',  '#0c93d7']} style={styles.addbtn} >
        <Button
          // buttonColor="#0047b9"
          // mode="contained"
          onPress={findDoctor}
          labelStyle={styles.addbtnText}
          >
          Submit
        </Button>
        </LinearGradient>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Doctor with this Name already exists do you want continue with
                same Doctor?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleYes}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleNo}>
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    marginBottom:15,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderWidth:1,
    borderColor:'#0047b9',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
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
  addbtnText1: {
    color: '#474747', // Set the text color here
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#0047b9',
  },
  modalButtonText: {
    color: '#0047b9',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  datePickerContainer: {
    flexDirection: 'column',
    // alignItems:'center'
  },
  datePickerLabel: {
    fontSize: 14, // You can adjust the font size as needed
    marginBottom: 3, // Spacing between label and button
    color: '#0047b9',
    fontWeight: '600',
  },
  datePickerButton: {
    width: 'auto',
    borderRadius: 5,
    textAlign: 'left',
    alignItems: 'flex-start',
    fontSize: 16, // You can adjust the font size as needed
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0047b9',
    color:'#000',
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
  profileimg: {
   
  },
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

export default UserProfileForm;
