import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image,TouchableOpacity,Modal } from 'react-native';
import { Button, Searchbar, IconButton  } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';


// Create separate components for each category's content
const CategoryDash = ({ users, filteredUsers, renderUserItem }) => (
    <View style={styles.container}>
      <Header />
      <UserList filteredUsers={filteredUsers} renderUserItem={renderUserItem} />
    </View>
  );
  
  const Header = () => {
    const [selectedValue, setSelectedValue] = useState('option1');
    const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (selectedDate) {
      setFromDate(selectedDate);
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    if (selectedDate) {
      setToDate(selectedDate);
    }
  };

  const showFromDate = () => {
    setShowFromDatePicker(true);
  };

  const showToDate = () => {
    setShowToDatePicker(true);
  };
   
  
    return (
      <View style={styles.headerMain}>
        <View style={[styles.row, styles.container1]}>
              <TouchableOpacity style={[styles.button1, styles.elevation]}>
                <Text style={styles.buttonText1}>Total Camps: </Text>
                <Text style={styles.buttonText1}>10 </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button1, styles.elevation]}>
                <Text style={styles.buttonText1}>Patient Screened:</Text>
                <Text style={styles.buttonText1}>15 </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button1, styles.elevation]}>
                <Text style={styles.buttonText1}>Patient Diagnosed:</Text>
                <Text style={styles.buttonText1}>12 </Text>
              </TouchableOpacity>
            </View>
        <View style={styles.headertop}>
          <Button
            icon="download"
            mode="contained"
            style={styles.addbtn}
            onPress={() => console.log('Pressed')}
          >
            Download
          </Button>
        </View>
        <View style={styles.header}>
        <View style={styles.pickcontainer}>
        <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            <Picker.Item label="Week wise" value="option1" />
            <Picker.Item label="Month wise" value="option2" />
            <Picker.Item label="Date Wise" value="option3" />
          </Picker>
        </View>
          
        </View>
        {/* <View style={styles.header}>
        <View style={{ flex:1,flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 8 }}>Select a date range:</Text>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerContainertext}>From: </Text>
            <Button onPress={showFromDate}>{fromDate.toDateString()}</Button>
            {showFromDatePicker && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                onChange={handleFromDateChange}
              />
            )}
          </View>
          <View style={styles.datePickerContainer}>
            <Text>To: </Text>
            <Button onPress={showToDate}>{toDate.toDateString()}</Button>
            {showToDatePicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                onChange={handleToDateChange}
              />
            )}
          </View>
        </View>
     
    </View> */}
    <View style={styles.header}>
    
  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    
    <View style={styles.datePickerContainer}>
    
      <Text style={styles.datePickerLabel}>From:</Text>
      <Button style={styles.datePickerButton} onPress={showFromDate}>{fromDate.toDateString()}</Button>
      {showFromDatePicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          onChange={handleFromDateChange}
        />
      )}
    </View>
    <View style={styles.datePickerContainer}>
      <Text style={styles.datePickerLabel}>To:</Text>
      <Button style={styles.datePickerButton} onPress={showToDate}>{toDate.toDateString()}</Button>
      {showToDatePicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          onChange={handleToDateChange}
        />
      )}
    </View>
  </View>
</View>
      </View>
    );
  };
  
  const UserList = ({ filteredUsers, renderUserItem }) => (
    <View style={styles.tableCont}>
      <TableHeader />
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
  
  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.columnHeader}>Name</Text>
      <Text style={styles.columnHeader}>Date</Text>
      <Text style={styles.columnHeader}>Actions</Text>
    </View>
  );
  
  const DashboardList = () => {
    const route = useRoute();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
  
    const onChangeSearch = (query) => setSearchQuery(query);
  
    const handleInfoButtonClick = (user) => {
      console.log('Info button clicked for user:', user);
      setSelectedUser(user);
    };

  let users = [];
  console.log(route.params.category);
  switch (route.params.category) {
    case 'Glucometer':
      users = [
        {
          id: 1,
          name: 'Suraj Report - Glucometer',
          qualification: 'Doctor',
          Date:'10-02-2022',
        },
        {
          id: 2,
          name: 'Suraj Report  - Glucometer',
          qualification: 'Engineer',
          Date:'10-02-2022',
        },
        // Add more users for Glucometer category as needed
      ];
      break;
    case 'Neuropathy':
      users = [
        {
          id: 3,
          name: 'Alice - Neuropathy',
          qualification: 'Doctor',
          Date:'10-02-2022',
        },
        {
          id: 4,
          name: 'Bob - Neuropathy',
          qualification: 'Engineer',
          Date:'10-02-2022',
        },
        // Add more users for Neuropathy category as needed
      ];
      break;
      case 'HbA1c':
      users = [
        {
          id: 3,
          name: 'Alice - HbA1c',
          qualification: 'Doctor',
          Date:'10-02-2022',
        },
        {
          id: 4,
          name: 'Bob - HbA1c',
          qualification: 'Engineer',
          Date:'10-02-2022',
        },
        // Add more users for Neuropathy category as needed
      ];
      break;
      case 'BMD':
      users = [
        {
          id: 3,
          name: 'Alice - BMD',
          qualification: 'Doctor',
          Date:'10-02-2022',
        },
        {
          id: 4,
          name: 'Bob - BMD',
          qualification: 'Engineer',
          Date:'10-02-2022',
        },
        // Add more users for Neuropathy category as needed
      ];
      break;
      case 'Glucometer & Neuropathy':
      users = [
        {
          id: 3,
          name: 'Alice - Glucometer & Neuropathy',
          qualification: 'Doctor',
          Date:'10-02-2022',
        },
        {
          id: 4,
          name: 'Bob - Glucometer & Neuropathy',
          qualification: 'Engineer',
          Date:'10-02-2022',
        },
        // Add more users for Neuropathy category as needed
      ];
      break;
    // Add cases for other categories as needed
    default:
      break;
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text>{item.name}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text>{item.Date}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <IconButton
            icon="arrow-down-bold-box"
            iconColor="#0054a4"
            size={20}
            onPress={() => console.log('Pressed')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <CategoryDash
      users={users}
      filteredUsers={filteredUsers}
      renderUserItem={renderUserItem}
    />
  );
};

const styles = StyleSheet.create({
    container1: {
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        
      },
      row: {
        flexDirection: 'row',
        marginBottom: 6,
      },
      button1: {
        flex: 1,
        margin:2,
        marginHorizontal: 2,
      
        height: 80,
        textAlign:'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:10,
    
      },
      buttonText1: {
        textAlign:'center',
        color: '#0054a4',
        fontSize: 15,
      },
      elevation: {
        elevation: 5 ,
        shadowColor: '#000',
      },
    containerDate: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      datePickerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal:20,
      },
      datePickerLabel: {
        fontSize: 16, // You can adjust the font size as needed
        marginBottom: 3, // Spacing between label and button
        color:'#0054a4',
        fontWeight:'600',
      },
      datePickerButton: {
        fontSize: 16, // You can adjust the font size as needed
        backgroundColor:'#fff',
        borderWidth: 1,
        borderColor: '#d4d4d2',
      },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
      },
  container: {
      flex: 1,
      
      // backgroundColor:'#e6e6e7',
    },
    headerMain: {
     
      padding:16
    },
    headertop: {
     
      flexDirection: 'row',
      justifyContent:'flex-end',
      alignItems: 'flex-end',
    },
    header: {
     
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pickcontainer:{
        backgroundColor:'white',
        borderWidth: 1,
        borderColor: '#d4d4d2',
        
       flex:1,
       borderRadius: 30,
        marginBottom: 10,
       
      },
      picker:{
        // backgroundColor:'#fff',
        width:'100%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 30,
        padding: 0,
      },
    addbtn:{
     backgroundColor: '#0054a4',
     paddingLeft:1,
     paddingRight:1,
     color:'white',
      // padding:2,
      marginTop:8,
      marginBottom:10,
      width:'42%',

    },
    searchInput: {
      flex: 1,
      height: 20,
      borderWidth: 1,
      borderColor: '#ccc',
      marginRight: 8,
      paddingHorizontal: 5,
    },
    tableCont:{
      margin:5,
      padding: 16,
      marginTop:5,
      flex: 1,
      backgroundColor:'#ffffff',
    },
    tableHeader: {
   borderRadius:5,
      marginTop:10,
      backgroundColor:'#0054a4',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      color:'#fff',
      textAlign: 'center',
    
    },
    columnHeader: {
      textAlign: 'center',
      // backgroundColor:'#000',
      color:'#fff',
      fontWeight: 'bold',
      flex: 1,
    },
    userItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: '#ccc',
    },
    userImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 8,
    },
    userInfo: {
      flex: 1,
    },
    actionButtons: {
      flexDirection: 'row',
    },
    actionButton: {
      // backgroundColor: 'blue',
      paddingHorizontal: 0,
      paddingVertical: 5,
      // borderRadius: 4,
      marginLeft: 0,
    },
    actionButtonText: {
      color: 'white',
    },
});

export default DashboardList;
