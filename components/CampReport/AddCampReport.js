import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {TextInput, Button, Avatar, DefaultTheme} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL} from '../Configuration/Config';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';
import useNetworkStatus from '../useNetworkStatus';

const AddCampReport = () => {
  const [doctorNames, setDoctorNames] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(false);
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
  const {id} = route.params;
  const formattedCampDate = format(campDate, 'dd-MM-yyyy');
  const [mrNames, setMrNames] = useState([]); // State to store MR names
  const initialSelectedMr = 'Name of MR';
  const initialSelectedTL = 'Name of TL';
  const initialSelectedSL = 'Name of Sl';
  const initialSelectedFL = 'Name of FL';
  const [selectedMr, setSelectedMr] = useState(initialSelectedMr);
  const [mrHQs, setMrHQs] = useState({}); // Store MR HQs
  const [selectedMrInfo, setSelectedMrInfo] = useState({
    empcode: '',
    hq: '',
    name: '',
  });
  const [mrData, setMrData] = useState([]);
  const [role, setRole] = useState([]);

  const [empCodeMain, setEmpCodeMain] = useState(null);
  const [showTLDropdown, setShowTLDropdown] = useState(true);
  const [showSLDropdown, setShowSLDropdown] = useState(true);
  const [showFLDropdown, setShowFLDropdown] = useState(true);

  const [tlNames, setTLNames] = useState([]);
  const [selectedTL, setSelectedTL] = useState(initialSelectedTL);
  const [tlHQs, setTLHQs] = useState({});
  const [selectedTLInfo, setSelectedTLInfo] = useState({
    empcode: '',
    hq: '',
    name: '',
  });
  const [tlData, setTLData] = useState([]);
  const [selectedTLEmployeeCode, setSelectedTLEmployeeCode] = useState('');

  // State and related information for SL
  const [slNames, setSLNames] = useState([]);
  const [selectedSL, setSelectedSL] = useState(initialSelectedSL);
  const [slHQs, setSLHQs] = useState({});
  const [selectedSLInfo, setSelectedSLInfo] = useState({
    empcode: '',
    hq: '',
    name: '',
  });
  const [slData, setSLData] = useState([]);
  const [selectedSLEmployeeCode, setSelectedSLEmployeeCode] = useState('');

  // State and related information for FL
  const [flNames, setFLNames] = useState([]);
  const [selectedFL, setSelectedFL] = useState(initialSelectedFL);
  const [flHQs, setFLHQs] = useState({});
  const [selectedFLInfo, setSelectedFLInfo] = useState({
    empcode: '',
    hq: '',
    name: '',
  });
  const [flData, setFLData] = useState([]);
  const [selectedFLEmployeeCode, setSelectedFLEmployeeCode] = useState('');
  const isConnected = useNetworkStatus();

  useEffect(() => {
    if (!isConnected) {
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    }
  }, [isConnected]);

  useEffect(() => {
    // Inside the useEffect, retrieve data from AsyncStorage
    AsyncStorage.getItem('userdata')
      .then(data => {
        if (data !== null) {
          const userData = JSON.parse(data);
          setRole(userData.responseData.role);
          const empcode = userData.responseData.empID; // Use the correct key to get empcode
          console.log('Retrieved data:', empcode);

          // Call fetchTLData with the retrieved empcode
          if (userData.responseData.role === 3) {
            // Set empcode for role 3
            setEmpCodeMain(empcode);
            console.log('Set EmpCode', empcode);
          } else if (userData.responseData.role === 4) {
            // Set empcode for role 4
            setSelectedTLEmployeeCode(empcode);
            console.log('Set EmpCode', empcode);
          } else if (userData.responseData.role === 5) {
            // Set empcode for role 5
            setSelectedSLEmployeeCode(empcode);
            console.log('Set EmpCode', empcode);
          } else if (userData.responseData.role === 6) {
            // Set empcode for role 6
            setSelectedFLEmployeeCode(empcode);
            console.log('Set EmpCode', empcode);
          }
        } else {
          // Data not found
          console.log('No data found with the key "userdata".');
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error retrieving data:', error);
      });
  }, []);

  useEffect(() => {
    // ... Your other code ...

    // Assuming the user's role is stored in the state variable 'role'
    switch (role) {
      case 3:
        // Role 3: All dropdowns are visible
        setShowTLDropdown(true);
        setShowSLDropdown(true);
        setShowFLDropdown(true);

        break;
      case 4:
        // Role 4: TL dropdown is hidden
        setShowTLDropdown(false);
        setShowSLDropdown(true);
        setShowFLDropdown(true);
        break;
      case 5:
        // Role 5: TL and SL dropdowns are hidden
        setShowTLDropdown(false);
        setShowSLDropdown(false);
        setShowFLDropdown(true);
        break;
      case 6:
        // Role 6: TL, SL, and FL dropdowns are hidden
        setShowTLDropdown(false);
        setShowSLDropdown(false);
        setShowFLDropdown(false);
        break;
      default:
        // Handle other cases here
        break;
    }
  }, [role]);

  useEffect(() => {
    const fetchTLData = empcode => {
      setIsLoading(true);
      // Replace 'API_URL_FOR_TL' with the actual API endpoint for TL data
      const ApiUrl = `${BASE_URL}${'/report/getEmpData'}`;
      console.log('this is empcode for TL :', empcode);
      fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empcode: empcode,
        }),
      })
        .then(response => response.json())
        .then(data => {
          // console.log('TL data:', data);
          if (data) {
            // Extract TL names and HQs from the API response
            const tlData = data.map(tl => ({
              name: tl.name,
              hq: tl.hq,
              empcode: tl.empcode,
            }));

            const tlHQs = {};
            tlData.forEach(tl => {
              tlHQs[tl.name] = tl.hq;
            });

            // Set the TL data, TL names, and their respective HQs in the state
            setTLData(tlData);
            setTLNames(tlData.map(tl => tl.name));
            setTLHQs(tlHQs);

            // Set the selected TL and HQ based on the initial TL (e.g., the first TL)
            const initialSelectedTL = tlData[0]?.name || '';
            setSelectedTL(initialSelectedTL);
            setHq(tlHQs[initialSelectedTL] || '');

            // Set selected TL's information in the state
            setSelectedTLInfo(tlData[0] || {});
            setSelectedTLEmployeeCode(tlData[0]?.empcode || '');
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching TL names and HQs:', error);
          setIsLoading(false);
        });
    };

    if (role === 3) {
      fetchTLData(empCodeMain);
    }
  }, [empCodeMain, role]);

  // Function to fetch SL data
  useEffect(() => {
    const fetchSLData = empcode => {
      setIsLoading(true);
      // Replace 'API_URL_FOR_SL' with the actual API endpoint for SL data
      const ApiUrl = `${BASE_URL}${'/report/getEmpData'}`;
      console.log('this is empcode for SL :', empcode);
      fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empcode: empcode,
        }),
      })
        .then(response => response.json())
        .then(data => {
          // console.log('SL data:', data);
          if (data) {
            // Extract SL names and HQs from the API response
            const slData = data.map(sl => ({
              name: sl.name,
              hq: sl.hq,
              empcode: sl.empcode,
            }));

            const slHQs = {};
            slData.forEach(sl => {
              slHQs[sl.name] = sl.hq;
            });

            // Set the SL data, SL names, and their respective HQs in the state
            setSLData(slData);
            setSLNames(slData.map(sl => sl.name));
            setSLHQs(slHQs);

            // Set the selected SL and HQ based on the initial SL (e.g., the first SL)
            const initialSelectedSL = slData[0]?.name || '';
            setSelectedSL(initialSelectedSL);
            setHq(slHQs[initialSelectedSL] || '');

            // Set selected SL's information in the state
            setSelectedSLInfo(slData[0] || {});
            setSelectedSLEmployeeCode(slData[0]?.empcode || '');
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching SL names and HQs:', error);
          setIsLoading(false);
        });
    };
    if (role === 3 || role === 4) {
      fetchSLData(selectedTLEmployeeCode);
    }
  }, [role, selectedTL, selectedTLEmployeeCode]);

  // Function to fetch FL data
  useEffect(() => {
    const fetchFLData = empcode => {
      setIsLoading(true);
      // Replace 'API_URL_FOR_FL' with the actual API endpoint for FL data
      const ApiUrl = `${BASE_URL}${'/report/getEmpData'}`;
      console.log('this is empcode for FL :', empcode);
      fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empcode: empcode,
        }),
      })
        .then(response => response.json())
        .then(data => {
          // console.log('FL data:', data);
          if (data) {
            // Extract FL names and HQs from the API response
            const flData = data.map(fl => ({
              name: fl.name,
              hq: fl.hq,
              empcode: fl.empcode,
            }));

            const flHQs = {};
            flData.forEach(fl => {
              flHQs[fl.name] = fl.hq;
            });

            // Set the FL data, FL names, and their respective HQs in the state
            setFLData(flData);
            setFLNames(flData.map(fl => fl.name));
            setFLHQs(flHQs);

            // Set the selected FL and HQ based on the initial FL (e.g., the first FL)
            const initialSelectedFL = flData[0]?.name || '';
            setSelectedFL(initialSelectedFL);
            setHq(flHQs[initialSelectedFL] || '');

            // Set selected FL's information in the state
            setSelectedFLInfo(flData[0] || {});
            setSelectedFLEmployeeCode(flData[0]?.empcode || '');
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching FL names and HQs:', error);
          setIsLoading(false);
        });
    };
    if (role === 3 || role === 4 || role === 5) {
      fetchFLData(selectedSLEmployeeCode);
    }
  }, [role, selectedSL, selectedSLEmployeeCode]);

  useEffect(() => {
    const fetchMrData = empcode => {
      setIsLoading(true);
      // Replace 'API_URL_FOR_FL' with the actual API endpoint for FL data
      const ApiUrl = `${BASE_URL}${'/report/getEmpData'}`;
      console.log('this is empcode for MR :', empcode);
      fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empcode: empcode,
        }),
      })
        .then(response => response.json())
        .then(data => {
          // console.log('MR data:', data);
          if (data) {
            // Extract FL names and HQs from the API response
            const mrData = data.map(mr => ({
              name: mr.name,
              hq: mr.hq,
              empcode: mr.empcode,
            }));

            const flHQs = {};
            mrData.forEach(mr => {
              mrHQs[mr.name] = mr.hq;
            });

            // Set the FL data, FL names, and their respective HQs in the state
            setMrData(mrData);
            setMrNames(mrData.map(mr => mr.name));
            setMrHQs(mrHQs);

            // Set the selected FL and HQ based on the initial FL (e.g., the first FL)
            const initialSelectedMr = mrData[0]?.name || '';
            setSelectedMr(initialSelectedMr);
            setHq(mrHQs[initialSelectedMr] || '');

            // Set selected FL's information in the state
            setSelectedMrInfo(mrData[0] || {});
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching FL names and HQs:', error);
          setIsLoading(false);
        });
    };
    if (role === 3 || role === 4 || role === 5 || role === 6) {
      fetchMrData(selectedFLEmployeeCode);
    }
  }, [mrHQs, role, selectedFL, selectedFLEmployeeCode]);

  const handleMrChange = itemValue => {
    setSelectedMr(itemValue);

    // Get the HQ for the selected MR from the mrHQs object
    const selectedMrHQ = mrHQs[itemValue];
    setHq(selectedMrHQ || ''); // Set HQ based on selected MR

    // Find the MR info for the selected MR
    const selectedMrInfo = mrData.find(mr => mr.name === itemValue) || {};

    // Update the selectedMrInfo state with the new MR info
    setSelectedMrInfo(selectedMrInfo);
  };

  const handleDropdownChange = (itemValue, dropdownType) => {
    switch (dropdownType) {
      case 'TL':
        setSelectedTL(itemValue);
        // Get the HQ for the selected TL from the tlHQs object
        const selectedTLHQ = tlHQs[itemValue];
        setHq(selectedTLHQ || '');
        // Find the TL info for the selected TL
        const selectedTLInfo = tlData.find(tl => tl.name === itemValue) || {};
        setSelectedTLInfo(selectedTLInfo);
        break;
      case 'SL':
        setSelectedSL(itemValue);
        // Get the HQ for the selected SL from the slHQs object
        const selectedSLHQ = slHQs[itemValue];
        setHq(selectedSLHQ || '');
        // Find the SL info for the selected SL
        const selectedSLInfo = slData.find(sl => sl.name === itemValue) || {};
        setSelectedSLInfo(selectedSLInfo);
        break;
      case 'FL':
        setSelectedFL(itemValue);
        // Get the HQ for the selected FL from the flHQs object
        const selectedFLHQ = flHQs[itemValue];
        setHq(selectedFLHQ || '');
        // Find the FL info for the selected FL
        const selectedFLInfo = flData.find(fl => fl.name === itemValue) || {};
        setSelectedFLInfo(selectedFLInfo);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Fetch doctor names from the API
    const ApiUrl = `${BASE_URL}${'/doc/getDoctorWithUserId'}`;

    // Fetch the userId from AsyncStorage
    AsyncStorage.getItem('userdata')
      .then(data => {
        if (data) {
          const userData = JSON.parse(data);
          const userId = userData.responseData.user_id;

          // Call fetchData with the retrieved userId
          console.log('Getting user id:', userId);

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
          console.log('Invalid or missing data in AsyncStorage');
        }
      })
      .then(response => {
        if (!response) {
          return; // Return early if there was an issue with AsyncStorage
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Extract doctor names from the response
          console.log(data);
          const names = data.map(doctor => doctor.doctor_name);
          setDoctorNames(names);
          console.log(names);
        }
      })
      .catch(error => {
        console.error('Error fetching doctor names:', error);
      });
  }, [id]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleItemSelect = item => {
    setSelectedItem(item);
    setTextInputValue(item);
    setIsDropdownVisible(false);
  };

  const filteredDropdownItems = dropdownItems.filter(item =>
    item.toLowerCase().includes(textInputValue.toLowerCase()),
  );
  const renderDropdownItem = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleItemSelect(item)}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );
  const handleTextInputChange = text => {
    setTextInputValue(text);
    // Filter the doctor names based on user input
    const filteredNames = doctorNames.filter(name =>
      name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredDoctorNames(filteredNames);
    setIsDropdownVisible(!!text); // Hide the dropdown if text is empty
  };

  const handleDoctorSelect = name => {
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

  const findDoctor = async () => {
    // Check if any required fields are empty
    if (!selectedMr || !textInputValue || !formattedCampDate) {
      // Display an alert message if any required fields are empty
      alert('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const ApiUrl = `${BASE_URL}${'/report/findDoctorPresent'}`;
      const response = await fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: textInputValue,
          date: formattedCampDate,
          empcode: selectedMrInfo.empcode || '',
        }),
      });

      const data = await response.json();
      console.log('Doctor finding response:', data);
      if (data.errorCode === '1') {
        console.log('Doctor found');
        Alert.alert(
          'Info',
          'Doctor already present with same MR and same date, Please change MR or Date ',
          [{text: 'OK', onPress: () => 'Ok Pressed'}],
        );
      } else {
        console.log('Doctor not found');
        submitData();
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const submitData = () => {
    // Fetch the userId from AsyncStorage
    AsyncStorage.getItem('userdata')
      .then(data => {
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
          console.log('Payload after', payload);
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
          console.log('Invalid or missing data in AsyncStorage');
          return Promise.reject('Invalid or missing data in AsyncStorage');
        }
      })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the API
        console.log('API Response:', data);

        // Check if the API request was successful
        if (data.errorCode === '1') {
          // Navigate to the "AddCampData" screen on success
          navigation.navigate('AddCampData', {crid: data.crid, id});
          console.log('navigation values', id);
          console.log('navigation crid', data.crid);
        } else if (data.errorCode === '2') {
          // Handle any other logic or display an error message
          console.log('A camp with the same MR and date already exists.');
          // Display an alert message for the user
          alert('A camp with the same MR and date already exists.');
        } else {
          // Handle any other logic or display an error message
          console.log('API Request was not successful');
          // Display an alert message for the user
          alert('API Request was not successful');
        }
      })
      .catch(error => {
        console.error('Error submitting data:', error);
        // Handle the error, e.g., display an error message to the user
        alert('Error submitting data. Please try again later.');
      });
  };

  return (
    <LinearGradient colors={['#72c5f8', '#daf5ff']} style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0047b9" />
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.form}>
          {showTLDropdown && (
            <View>
              <Text style={styles.datePickerLabel}>Select Name of TL:</Text>
              <View style={styles.pickcontainer}>
                <Picker
                  selectedValue={selectedTL}
                  style={styles.picker}
                  onValueChange={itemValue => {
                    setSelectedTL(itemValue);
                    // Get the employee code for the selected TL from TL data
                    const selectedTLEmployeeCode =
                      tlData.find(tl => tl.name === itemValue)?.empcode || '';
                    setSelectedTLEmployeeCode(selectedTLEmployeeCode);
                  }}>
                  {tlNames.map((name, index) => (
                    <Picker.Item key={index} label={name} value={name} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {showSLDropdown && (
            <View>
              <Text style={styles.datePickerLabel}>Select Name of SL:</Text>
              <View style={styles.pickcontainer}>
                <Picker
                  selectedValue={selectedSL}
                  style={styles.picker}
                  onValueChange={itemValue => {
                    setSelectedSL(itemValue);
                    // Get the employee code for the selected TL from TL data
                    const selectedSLEmployeeCode =
                      slData.find(sl => sl.name === itemValue)?.empcode || '';
                    setSelectedSLEmployeeCode(selectedSLEmployeeCode);
                  }}>
                  {slNames.map((name, index) => (
                    <Picker.Item key={index} label={name} value={name} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {showFLDropdown && (
            <View>
              <Text style={styles.datePickerLabel}>Select Name of FL:</Text>
              <View style={styles.pickcontainer}>
                <Picker
                  selectedValue={selectedFL}
                  style={styles.picker}
                  onValueChange={itemValue => {
                    setSelectedFL(itemValue);
                    // Get the employee code for the selected TL from TL data
                    const selectedFLEmployeeCode =
                      flData.find(fl => fl.name === itemValue)?.empcode || '';
                    setSelectedFLEmployeeCode(selectedFLEmployeeCode);
                  }}>
                  {flNames.map((name, index) => (
                    <Picker.Item key={index} label={name} value={name} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          <Text style={styles.datePickerLabel}>Select Name of MR:</Text>
          <View style={styles.pickcontainer}>
            <Picker
              selectedValue={selectedMr}
              style={styles.picker}
              onValueChange={handleMrChange}>
              {mrNames.map((name, index) => (
                <Picker.Item key={index} label={name} value={name} />
              ))}
            </Picker>
          </View>
          <Text style={styles.datePickerLabel}>Name of Doctor</Text>
          <View style={styles.inputContainer}>
            <TextInput
              backgroundColor="#fff"
              underlineColor="#fff"
              style={styles.inputField}
              outlineColor="#0047b9"
              theme={{
                ...DefaultTheme,
                colors: {
                  ...DefaultTheme.colors,
                  primary: '#0047b9', // Change the label color to blue
                },
              }}
              activeOutlineColor="#08a5d8"
              value={textInputValue}
              onChangeText={handleTextInputChange}
              // label="Name of Doctor"
            />
            {isDropdownVisible && (
              <FlatList
                data={filteredDoctorNames}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleDoctorSelect(item)}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                style={styles.dropdownList}
              />
            )}
          </View>

          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerLabel} onPress={showCampDate}>
              Select Date of Camp:
            </Text>
            <Button
              style={styles.datePickerButton}
              onPress={showCampDate}
              labelStyle={styles.addbtnText1}>
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
                maximumDate={new Date()}
                dateFormat="DD-MM-YYYY"
                onChange={handleCampDateChange}
              />
            )}
          </View>
          <Text style={styles.datePickerLabel}>HQ</Text>
          <TextInput
            // label="HQ"
            value={hq}
            onChangeText={text => setHq(text)}
            mode="outlined"
            style={styles.input}
            outlineColor="#0047b9"
            activeOutlineColor="#08a5d8"
            editable={false}
          />
          <LinearGradient colors={['#0047b9', '#0c93d7']} style={styles.addbtn}>
            <Button onPress={findDoctor} labelStyle={styles.addbtnText}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                'Next'
              )}
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
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  inputField: {
    padding: 0,
    fontSize: 15,
  },
  dropdownList: {
    maxHeight: 150, // Set a max height for the dropdown list
    borderColor: '#ccc',
    backgroundColor: '#fff',
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
  pickcontainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#0047b9',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    // backgroundColor:'#fff',
    width: '100%',
    borderWidth: 1,
    borderColor: '#0047b9',
    borderRadius: 5,
    padding: 0,
  },
  datePickerLabel: {
    fontSize: 14, // You can adjust the font size as needed
    marginBottom: 0, // Spacing between label and button
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
  addbtn: {
    backgroundColor: '#0047b9',
    paddingLeft: 1,
    paddingRight: 1,
    color: 'white',
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 50,
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
