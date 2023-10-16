import React, { useState,useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList,ActivityIndicator  } from 'react-native';
import { TextInput, Button, Avatar,DefaultTheme  } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../Configuration/Config';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO } from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';

const UpdateCampReport = () => {
  const [isLoading, setIsLoading] = useState(true);
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
  const [userEmpcode, setUserEmpcode] = useState();
  const [hq, setHq] = useState();
  const [mrNames, setMrNames] = useState([]); // State to store MR names
  const [mrData, setMrData] = useState([]); // Define mrData state
  const initialSelectedMr = 'Name of MR';
  const [selectedMr, setSelectedMr] = useState(initialSelectedMr);
  const [mrHQs, setMrHQs] = useState({}); // Store MR HQs
  const [dropdownItems] = useState(['Option 1', 'node', 'React']);
  const route = useRoute();
  const [selectedEmpcode, setSelectedEmpcode] = useState('');
  
  
  const {crId, id } = route.params;
  // console.log('geting cid',crId)

  useEffect(() => {
    const fetchData = async (empcode) => {
      setIsLoading(true);
      try {
       
        // Fetch doctor data
        const payload = {
          crId: crId
        }
        const ApiUrl = `${BASE_URL}${'/report/getReportInfoWithId'}`;
        const response = await fetch(ApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("data is: ",data)
          if (Array.isArray(data) && data.length > 0) {
            const doctorData = data[0];
            console.log("Data camp:", doctorData);
            setTextInputValue(doctorData.doctor_name);
            const campDateParts = doctorData.camp_date.split('-');
            if (campDateParts.length === 3) {
              const day = parseInt(campDateParts[0], 10);
              const month = parseInt(campDateParts[1], 10) - 1; // Month is 0-based
              const year = parseInt(campDateParts[2], 10);
              const campDate = new Date(year, month, day);
              setCampDate(campDate);
            } else {
              console.error('Invalid camp date format:', doctorData.camp_date);
            }
  
            // Store doctorData.empcode in a separate state variable
            const doctorEmpcode = doctorData.empcode;
            console.log("EmpCode is: ",doctorEmpcode);
            setUserEmpcode(doctorEmpcode);
            
  
            // Fetch MR names and HQs using doctorEmpcode
            const mrApiUrl = `${BASE_URL}${'/report/getEmpData'}`;
            const mrResponse = await fetch(mrApiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                empcode: empcode,
              }),
            });
  
            if (mrResponse.ok) {
              const mrData = await mrResponse.json();
              if (mrData && mrData.length > 0) {
                setMrData(mrData);
                const mrInfo = mrData[0];
                setMrNames(mrData.map((mr) => mr.name));
                const mrHQs = {};
                const mrEmpcodes = {}; // Add this map for empcode
                mrData.forEach((mr) => {
                  mrHQs[mr.name] = mr.hq;
                  mrEmpcodes[mr.name] = mr.empcode; // Map MR names to empcodes
                });
                setMrHQs(mrHQs);
                
                
  
                // Find the matching MR using doctorEmpcode
                const matchingMr = mrData.find((mr) => mr.empcode === doctorEmpcode);
                if (matchingMr) {
                  // console.log("Match", matchingMr.name);
                  setSelectedMr(matchingMr.name);
                  setHq(matchingMr.hq);
                  setSelectedEmpcode(matchingMr.empcode)
                  // console.log("Emp code:",matchingMr.empcode);
                } else {
                  console.log('No matching MR found');
                }
              } else {
                console.log('No MR data found');
              }
            } else {
              console.log('Error fetching MR data:', mrResponse.statusText);
            }
          }
        } else {
          console.log('Error fetching doctor data:', response.statusText);
        }
        setIsLoading(false);
      } catch (error) {
     
        console.log('Error fetching data:', error);
        setIsLoading(false); 
      }
      
    };
   AsyncStorage.getItem('userdata')
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data);
          const empcode = userData.responseData.empID;
          // Call fetchData with the retrieved userId
       
          fetchData(empcode)
        } else {
          console.error('Invalid or missing data in AsyncStorage');
        }
      })
      .catch((error) => {
        console.error('Error retrieving data:', error);
      });
  
    fetchData();
  }, [crId]);




  const handleMrChange = (itemValue) => {
    setSelectedMr(itemValue);

    // Find the matching MR using the selectedMr value
    const matchingMr = mrData.find((mr) => mr.name === itemValue);
    if (matchingMr) {
      setSelectedEmpcode(matchingMr.empcode);
      console.log("Emp code After:",selectedEmpcode);
      setHq(matchingMr.hq);
    } else {
      console.error('No matching MR found');
    }
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
          // const campData = data[0];
          const names = data.map((doctor) => doctor.doctor_name);
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
           empcode:selectedEmpcode,
            doctorName: textInputValue,
            campDate: formattedCampDate,
          };
  console.log("payload after:",payload)
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
    <LinearGradient colors={['#72c5f8',  '#daf5ff']} style={styles.container} >
      {/* Loading indicator */}
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
      <Text style={styles.datePickerLabel}>Name of Doctor</Text>
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
        

<View style={styles.datePickerContainer} >
    
    <Text style={styles.datePickerLabel} onPress={showCampDate}>Select Date of Camp:</Text>
    <Button style={styles.datePickerButton} onPress={showCampDate}  labelStyle={styles.addbtnText1}>
    {formattedCampDate}
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
  <Text style={styles.datePickerLabel}>HQ
  </Text>
  <TextInput
          // label="HQ"
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
    marginBottom: 0, // Spacing between label and button
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
     //  backgroundColor:'#B9D9EB',
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
  addbtnText1: {
    color: '#474747', // Set the text color here
  },
});

export default UpdateCampReport;
