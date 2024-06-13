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
} from 'react-native';
import {TextInput, Button, Avatar, DefaultTheme} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL} from './Configuration/Config';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';
import MultiSelect from 'react-native-multiple-select';

const Test = () => {
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
  const {id} = 1;
  const formattedCampDate = format(campDate, 'dd-MM-yyyy');
  const [mrNames, setMrNames] = useState([]); // State to store MR names
  const initialSelectedMr = 'Name of MR';
  const initialSelectedTL = 'Name of TL';
  const initialSelectedSL = 'Name of Sl';
  const initialSelectedFL = 'Name of FL';

  const [selectedItems, setSelectedItems] = useState([]);

  const items = [
    {id: '1', name: 'Glimestar'},
    {id: '2', name: 'SGLTD'},
    {id: '3', name: 'Dynaglipt'},
    {id: '4', name: 'Dynaglipt-L'},
    {id: '5', name: 'Nurokind Plus'},
    {id: '6', name: 'Caldkind-Plus'},
    {id: '7', name: 'Glykind'},
  ];

  const onSelectedItemsChange = selectedItems => {
    setSelectedItems(selectedItems);
  };

  const submitData = () => {
    console.log('selected Data of list:', selectedItems);
  };

  return (
    <LinearGradient colors={['#72c5f8', '#daf5ff']} style={styles.container}>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text>Selected Items: {selectedItems.join(', ')}</Text>
          <MultiSelect
            outlineColor="#0047b9"
            activeOutlineColor="#08a5d8"
            style={styles.input}
            items={items}
            uniqueKey="id"
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="Pick Brand"
            searchInputPlaceholderText="Search Items..."
            onChangeInput={text => console.log(text)}
            tagRemoveIconColor="#007aff"
            tagBorderColor="#007aff"
            tagTextColor="#007aff"
            selectedItemTextColor="#007aff"
            selectedItemIconColor="#007aff"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{color: '#007aff'}}
            submitButtonColor="#007aff"
            submitButtonText="Submit"
          />
          <LinearGradient colors={['#0047b9', '#0c93d7']} style={styles.addbtn}>
            <Button onPress={submitData} labelStyle={styles.addbtnText}>
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
    borderColor: '#0047b9',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0047b9',
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
    padding: 20,
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

  mainWrapper: {
    borderColor: '#007aff',
    borderRadius: 8,
  },
  rowList: {
    borderColor: '#007aff',
    borderRadius: 8,
  },
  selectorContainer: {
    borderColor: '#007aff',
    borderRadius: 8,
  },
  dropdownMenuSubsection: {
    borderColor: '#007aff',
    borderRadius: 8,
  },
  inputGroup: {
    borderColor: '#007aff',
    borderRadius: 8,
  },
  textDropdown: {
    color: '#007aff',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  listContainer: {
    borderColor: '#007aff',
    borderRadius: 8,
  },
  itemText: {
    color: '#000',
  },

  textDropdownSelected: {
    color: '#007aff',
  },
});

export default Test;
