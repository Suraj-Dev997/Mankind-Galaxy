import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { TextInput, Button, Avatar,DefaultTheme  } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const AddCampReport = () => {
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [avatarUri, setAvatarUri] = useState(null); // To store the URI of the selected image
  const [campDate, setCampDate] = useState(new Date());
  const [showCampDatePicker, setShowCampDatePicker] = useState(false);
  const [selectedValue, setSelectedValue] = useState('option1');
  const navigation = useNavigation();

  const [textInputValue, setTextInputValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownItems] = useState(['Option 1', 'node', 'React']);

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
    if (text.trim() === '') {
      setIsDropdownVisible(false);
    } else {
      setIsDropdownVisible(true);
    }
  };
  
  const handleCampDateChange = (event, selectedDate) => {
    setShowCampDatePicker(false);
    if (selectedDate) {
      setCampDate(selectedDate);
    }
  };
  const showCampDate = () => {
    setShowCampDatePicker(true);
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
        

<View style={styles.datePickerContainer} >
    
    <Text style={styles.datePickerLabel} onPress={showCampDate}>Select Date of Camp:</Text>
    <Button style={styles.datePickerButton} onPress={showCampDate}>{campDate.toLocaleDateString()}</Button>
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


      <View style={styles.inputContainer}>
        <TextInput
        //  mode="outlined"
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
          // style={styles.inputField}
          value={textInputValue}
          onChangeText={handleTextInputChange}
          label="Name of Doctor"
        />
        {isDropdownVisible && (
          <FlatList
            data={filteredDropdownItems}
            renderItem={renderDropdownItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.dropdownList}
          />
        )}
      </View>


        <Button
        buttonColor='#0054a4'
          mode="contained"
          onPress={()=> navigation.navigate("AddCampData")}
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

export default AddCampReport;
