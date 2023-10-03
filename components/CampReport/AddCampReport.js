import React, { useState,useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList,ActivityIndicator } from 'react-native';
import { TextInput, Button, Avatar,DefaultTheme  } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../Configuration/Config';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';

const AddCampReport = () => {
  const [doctorNames, setDoctorNames] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [filteredDoctorNames, setFilteredDoctorNames] = useState([]);
  const [qualification, setQualification] = useState('');
  const [avatarUri, setAvatarUri] = useState(null); // To store the URI of the selected image
  const [campDate, setCampDate] = useState(new Date());
  const [showCampDatePicker, setShowCampDatePicker] = useState(false);
  const [hq, setHq] = useState();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [textInputValue, setTextInputValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownItems] = useState(['Option 1', 'node', 'React']);
  const route = useRoute();
  const { id } = route.params;
  const formattedCampDate = format(campDate, 'dd-MM-yyyy');
  const [mrNames, setMrNames] = useState([]); // State to store MR names
  const initialSelectedMr = 'Name of MR';
  const [selectedMr, setSelectedMr] = useState(initialSelectedMr);
  const [mrHQs, setMrHQs] = useState({}); // Store MR HQs
  const [selectedMrInfo, setSelectedMrInfo] = useState({ empcode: '', hq: '', name: '' });
  const [mrData, setMrData] = useState([]); 

  useEffect(() => {
    
    const fetchMRData = (empcode) => {
      setIsLoading(true);
    const ApiUrl = `${BASE_URL}${'/report/getEmpData'}`;
    fetch(ApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        empcode: empcode,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data getting", data);
        if (data) {
          // Extract MR names and HQs from the API response
          const mrData = data.map((mr) => ({
            name: mr.name,
            hq: mr.hq,
            empcode: mr.empcode, // Include empcode in the MR data
          }));
  
          // Create an object to store MR names and their respective HQs
          const mrHQs = {};
          mrData.forEach((mr) => {
            mrHQs[mr.name] = mr.hq;
          });
  
          // Set the MR data, MR names, and their respective HQs in the state
          setMrData(mrData);
          setMrNames(mrData.map((mr) => mr.name));
          setMrHQs(mrHQs);
  
          // Set the selected MR and HQ based on the initial MR (e.g., the first MR)
          const initialSelectedMr = mrData[0]?.name || '';
          setSelectedMr(initialSelectedMr);
          setHq(mrHQs[initialSelectedMr] || '');
  
          // Set selected MR's information in the state
          setSelectedMrInfo(mrData[0] || {});
          setIsLoading(false); 
        }
      })
      .catch((error) => {
        console.error('Error fetching MR names and HQs:', error);
        setIsLoading(false); 
      });
     
    }

      AsyncStorage.getItem('userdata')
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data);
          const empcode = userData.responseData.empID;
          // Call fetchData with the retrieved userId
          console.log("Getting user id:", empcode)
          fetchMRData(empcode)
        } else {
          console.error('Invalid or missing data in AsyncStorage');
        }
      })
      .catch((error) => {
        console.error('Error retrieving data:', error);
      });
      fetchMRData();
  }, []);
  
  
  
  const handleMrChange = (itemValue) => {
    setSelectedMr(itemValue);
  
    // Get the HQ for the selected MR from the mrHQs object
    const selectedMrHQ = mrHQs[itemValue];
    setHq(selectedMrHQ || ''); // Set HQ based on selected MR
  
    // Find the MR info for the selected MR
    const selectedMrInfo = mrData.find((mr) => mr.name === itemValue) || {};
  
    // Update the selectedMrInfo state with the new MR info
    setSelectedMrInfo(selectedMrInfo);
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
    // Check if any required fields are empty
    if (!selectedMr || !textInputValue || !formattedCampDate ) {
      // Display an alert message if any required fields are empty
      alert('Please fill in all required fields');
      return;
    }
  
    // Fetch the userId from AsyncStorage
    AsyncStorage.getItem('userdata')
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data);
          const userId = userData.responseData.user_id;
  
          // Define the payload using the retrieved userId
          const payload = {
            userId: userId, // Use the retrieved userId here
            subCatId: id,
            empcode: selectedMrInfo.empcode || '',
            doctorName: textInputValue,
            campDate: formattedCampDate,
          };
          console.log("Payload after", payload);
          const ApiUrl = `${BASE_URL}${'/report/addReportWithInfo'}`;
  
          // Make the POST request
          return fetch(ApiUrl, {
            method: 'POST',
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
          navigation.navigate("AddCampData", { crid: data.crid, id });
          console.log("navigation values", id);
        } else {
          // Handle any other logic or display an error message
          console.log('API Request was not successful');
          // Display an alert message for the user
          alert('API Request was not successful');
        }
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
        // Handle the error, e.g., display an error message to the user
        alert('Error submitting data. Please try again later.');
      });
  };
  
  
 

  return (
    <LinearGradient colors={['#72c5f8',  '#daf5ff']} style={styles.container} >
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0047b9" />
        </View>
      )}
       <View style={styles.container}>
      

      <View style={styles.form}>
      <Text style={styles.datePickerLabel}>Select Name of MR:</Text>
      <View style={styles.pickcontainer}>
     
        <Picker
          selectedValue={selectedMr}
          style={styles.picker}
          onValueChange={handleMrChange}
        >
         
          {mrNames.map((name, index) => (
            <Picker.Item key={index} label={name} value={name} />
          ))}
        </Picker>
      </View>
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
        

<View style={styles.datePickerContainer} >
    
    <Text style={styles.datePickerLabel} onPress={showCampDate}>Select Date of Camp:</Text>
    <Button style={styles.datePickerButton} onPress={showCampDate}  labelStyle={styles.addbtnText1}>
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
  <TextInput
          label="HQ"
          value={hq}
          onChangeText={(text) => setHq(text)}
          mode="outlined"
          style={styles.input}
          outlineColor='#0047b9'
          activeOutlineColor='#08a5d8'
          editable={false}
        />
 <LinearGradient colors={['#0047b9',  '#0c93d7']} style={styles.addbtn} >
 <Button
       
          onPress={submitData}
          
          labelStyle={styles.addbtnText}
        >
          Next
        </Button>
 </LinearGradient>
        
      </View>
    </View>
 </LinearGradient>
   
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Place it above other UI components
  },
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
  additionalInputLabel: {
    marginTop: 16,
    fontSize: 16,
  },
  additionalInput: {
    borderColor: '#0047b9',
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
    borderColor: '#0047b9',
   borderRadius: 5,
    marginBottom: 15,
   
  },
  picker:{
    // backgroundColor:'#fff',
    width:'100%',
    borderWidth: 1,
    borderColor: '#0047b9',
    borderRadius: 5,
    padding: 0,
  },
  datePickerLabel: {
    fontSize: 14, // You can adjust the font size as needed
    marginBottom: 3, // Spacing between label and button
    color:'#0047b9',
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
    borderColor: '#0047b9',
    padding:5,
    marginBottom: 12,
  },
  container: {
      // backgroundColor:'#B9D9EB',
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
    color: '#0047b9',
    textAlign: 'center',
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
});

export default AddCampReport;
