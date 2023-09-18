import React, { useState,useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { TextInput, Button, Avatar,DefaultTheme  } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../Configuration/Config';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO } from 'date-fns';

const UpdateCampReport = () => {
  const [doctorNames, setDoctorNames] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [filteredDoctorNames, setFilteredDoctorNames] = useState([]);
  const [qualification, setQualification] = useState('');
  const [avatarUri, setAvatarUri] = useState(null); // To store the URI of the selected image
  const [campDate, setCampDate] = useState(new Date());
  const [showCampDatePicker, setShowCampDatePicker] = useState(false);
  const [selectedValue, setSelectedValue] = useState('option1');
  const navigation = useNavigation();
  const formattedCampDate = format(campDate, 'dd-MM-yyyy');
  const [textInputValue, setTextInputValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownItems] = useState(['Option 1', 'node', 'React']);
  const route = useRoute();
  const {crId, id } = route.params;
  // console.log('geting cid',crId)

  
  useEffect(() => {
    const handleMoreInfo = async(doctor) => {
       
        try {
        
          const payload ={
            crId:crId
          }
          const ApiUrl = `${BASE_URL}${'/report/getReportInfoWithId'}`;
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
              const dateParts = doctorData.camp_date.split('-');
              const year = parseInt(dateParts[0]);
              const month = parseInt(dateParts[1]) - 1; // Month is zero-based
              const day = parseInt(dateParts[2]);
              setCampDate(new Date(year, month, day));
              // console.log(campDate)
            }
          } else {
            console.error('Error fetching doctor data:', response.statusText);
          }
        } catch (error) {
          console.log('Error saving data:', error);
        } 
      }
    handleMoreInfo();
  }, [crId]);


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
          // const campData = data[0];
          const names = data[0].map((doctor) => doctor.doctor_name);
          setDoctorNames(names);
       
        }
      })
      .catch((error) => {
        console.error('Error fetching doctor names:', error);
      });
  }, [id]);
  

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setTextInputValue(item);
    setIsDropdownVisible(false);
  };

  const filteredDropdownItems = dropdownItems.filter((item) =>
    item.toLowerCase().includes(textInputValue.toLowerCase())
  );
  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleItemSelect(item)}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );
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

  const submitData = () => {
    const { crId, id } = route.params; 
    // Fetch the userId from AsyncStorage
    AsyncStorage.getItem('userdata')
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data);
          const userId = userData.responseData.user_id;
  
          // Define the payload using the retrieved userId
          const payload = {
            userId: userId, // Use the retrieved userId here
            crId: crId,
            doctorName: textInputValue,
            campDate: formattedCampDate,
          };
  
          const ApiUrl = `${BASE_URL}${'/report/updateReportWithInfo'}`;
  
          // Make the POST request
          return fetch(ApiUrl, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
        } else {
          console.error('Invalid or missing data in AsyncStorage');
          return Promise.reject('Invalid or missing data in AsyncStorage');
        }
      })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the API
        console.log('API Response:', data);
  
        // Check if the API request was successful
        if (data.errorCode === "1") {
          // Navigate to the "AddCampData" screen on success
          navigation.navigate("UpdateCampData", {crid:crId,  id });
          console.log("navigation values",crId);
        } else {
          // Handle any other logic or display an error message
          console.error('API Request was not successful');
          // You can also display an error message to the user
        }
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
        // Handle the error, e.g., display an error message to the user
      });
  };
  
 

  return (
    <View style={styles.container}>
      

      <View style={styles.form}>
      <View style={styles.pickcontainer}>
        <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            <Picker.Item label="Name of MR" value="option1" />
            <Picker.Item label="option1" value="option2" />
            <Picker.Item label="option2" value="option3" />
          </Picker>
        </View>
        
      <View style={styles.inputContainer}>
          <TextInput
            backgroundColor='#fff'
            underlineColor='#fff'
            style={styles.inputField}
            outlineColor='#0054a4'
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                primary: '#0054a4', // Change the label color to blue
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
        

<View style={styles.datePickerContainer} >
    
    <Text style={styles.datePickerLabel} onPress={showCampDate}>Select Date of Camp:</Text>
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
  {/* <TextInput
          label="Name of Doctor"
          value={qualification}
          onChangeText={(text) => setQualification(text)}
          mode="outlined"
          style={styles.input}
          outlineColor='#0054a4'
          activeOutlineColor='#08a5d8'
        /> */}


     
      
        <View style={styles.pickcontainer}>
        <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            <Picker.Item label="HQ" value="option1" />
            <Picker.Item label="option1" value="option2" />
            <Picker.Item label="option2" value="option3" />
          </Picker>
        </View>

        <Button
        buttonColor='#0054a4'
          mode="contained"
          onPress={submitData}
          
          style={styles.button}
        >
          Next
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderColor: '#0054a4',
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
  additionalInputLabel: {
    marginTop: 16,
    fontSize: 16,
  },
  additionalInput: {
    borderColor: '#0054a4',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  datePickerContainer: {
    flexDirection: 'column',
// alignItems:'center'
 
  
  },
  pickcontainer:{
    backgroundColor:'white',
    borderWidth: 1,
    borderColor: '#0054a4',
   borderRadius: 5,
    marginBottom: 15,
   
  },
  picker:{
    // backgroundColor:'#fff',
    width:'100%',
    borderWidth: 1,
    borderColor: '#0054a4',
    borderRadius: 5,
    padding: 0,
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

export default UpdateCampReport;
