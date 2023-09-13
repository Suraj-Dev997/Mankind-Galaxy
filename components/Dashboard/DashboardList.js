import React, { useState,useEffect } from 'react';
import { View, Text,TextInput, StyleSheet, FlatList, Image,TouchableOpacity,Modal, ScrollView } from 'react-native';
import { Button, Searchbar, IconButton   } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from '../Configuration/Config';


// Create separate components for each category's content
const CategoryDash = ({ users, filteredUsers, renderUserItem }) => (
    <View style={styles.container}>
     <Header />
    <View style={styles.tableCont}>
      <TableHeader />
      
    </View>
    </View>
  );
  
  const Header = () => {
    const [selectedValue, setSelectedValue] = useState('option1');
    const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [totalCamps, setTotalCamps] = useState(0);
  const [totalScreened, setTotalScreened] = useState(0);
  const [totalDiagnosed, setTotalDiagnosed] = useState(0);

  const route = useRoute();
  const { id, name } = route.params;


  

  useEffect(() => {
    const fetchTotalScreened = async () => {
      try {
        const ApiUrl = `${BASE_URL}${'/dashboard/getTotalPaScreened'}`;
        const response = await fetch(ApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 1, // You can change the user ID as needed
            subCatId:id
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const ScreenedCount = data[0].p_screened_count;
            setTotalScreened(ScreenedCount);
          }
        } else {
          console.error('Failed to fetch Total Doctors data');
        }
      } catch (error) {
        console.error('Error fetching Total Doctors data:', error);
      }
    };
    fetchTotalScreened();
  }, [id]);

  
  useEffect(() => {
    const fetchTotalDiagnosed = async () => {
      try {
        const ApiUrl = `${BASE_URL}${'/dashboard/getTotalPaDiagnosed'}`;
        const response = await fetch(ApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 1, // You can change the user ID as needed
            subCatId:id
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const DiagnosedCount = data[0].p_diagnosed_count;
            setTotalDiagnosed(DiagnosedCount);
          }
        } else {
          console.error('Failed to fetch Total Doctors data');
        }
      } catch (error) {
        console.error('Error fetching Total Doctors data:', error);
      }
    };
  
    fetchTotalDiagnosed();
  }, [id]);

  
  useEffect(() => {
    const fetchTotalCamps = async () => {
      try {
        const ApiUrl = `${BASE_URL}${'/dashboard/getTotalCampsWithId'}`;
        const response = await fetch(ApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 1, // You can change the user ID as needed
            subCatId:id
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const CampCount = data[0].camp_count;
            setTotalCamps(CampCount);
          }
        } else {
          console.error('Failed to fetch Total Doctors data');
        }
      } catch (error) {
        console.error('Error fetching Total Doctors data:', error);
      }
    };
  
    fetchTotalCamps();
  }, [id]);

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
                <Text style={styles.buttonText1}>{totalCamps} </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button1, styles.elevation]}>
                <Text style={styles.buttonText1}>Patient Screened:</Text>
                <Text style={styles.buttonText1}>{totalScreened} </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button1, styles.elevation]}>
                <Text style={styles.buttonText1}>Patient Diagnosed:</Text>
                <Text style={styles.buttonText1}>{totalDiagnosed} </Text>
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
    <View style={styles.header}>
    
    {selectedValue === 'option3' && (
  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

  <LinearGradient colors={['#0054a4',  '#00aacf']} style={styles.datePickerContainer}>
  <Button
          icon="calendar"
          mode="contained"
          style={styles.addbtn1}
          onPress={showFromDate}
          // contentStyle={{ flexWrap: 'wrap' }}
        >
       From: {fromDate.toLocaleDateString()}
        </Button>
        {showFromDatePicker && (
      <DateTimePicker
        value={fromDate}
        mode="date"
        onChange={handleFromDateChange}
        
      />
    )}
    </LinearGradient>
  
 
  <LinearGradient colors={['#0054a4',  '#00aacf']} style={styles.datePickerContainer}>
  <Button
          icon="calendar"
          mode="contained"
        
          style={styles.addbtn1}
          onPress={showToDate}
          // contentStyle={{ flexWrap: 'wrap' }}
        >
       To: {toDate.toLocaleDateString()}
        </Button>
    {showToDatePicker && (
      <DateTimePicker
        value={toDate}
        mode="date"
        onChange={handleToDateChange}
      />
    )}
  </LinearGradient>
</View>
)}
  

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
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      // Fetch data from the API
      const ApiUrl = `${BASE_URL}${'/dashboard/getFilterCampReport'}`;
      fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          setData(responseData);
          console.log(responseData)
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
          setIsLoading(false);
        });
    }, []);
  
    // Render loading indicator if data is still loading
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      );
    }
    const renderUserItem = ({ item }) => {
      const campDate = new Date(item.camp_date);

      // Define date options for formatting
  const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  // Format the date using toLocaleDateString
  const formattedDate = campDate.toLocaleDateString('en-US', dateOptions);
      
  return(
    <View style={styles.userItem}>
        <View style={styles.userInfo}>
          <Text>{item.doctor_name}</Text>
    
        </View>
        <View style={styles.userInfo}>
      
          <Text> {formattedDate}</Text>
        </View>
        <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <IconButton
            icon="arrow-down-bold-box"
            iconColor="#0054a4"
            size={30}
            onPress={() => console.log('Pressed')}
          />
        </TouchableOpacity>
        </View>
      </View>
  );
      
  };

  

  return (
    <View style={styles.container}>
    <Header />
    <View style={styles.tableCont}>
      <TableHeader/>
    <FlatList
      data={data}
      keyExtractor={(item) => item.crid.toString()}
      renderItem={renderUserItem}
    />
    </View>
   
  </View>
    
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
        borderRadius:10,
        // paddingHorizontal:1,
      },
      datePickerLabel: {
        fontSize: 16, // You can adjust the font size as needed
        marginBottom: 3, // Spacing between label and button
        color:'#0054a4',
        fontWeight:'600',
      },
      datePickerButton: {
        fontSize: 16, // You can adjust the font size as needed
        backgroundColor:'#ffffff',
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
    addbtn1:{
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      borderRadius:10,
      backgroundColor: 'transparent', // Set the background color to transparent
        borderColor: 'transparent',
      // backgroundColor: '#0054a4',
      // paddingLeft:1,
      // paddingRight:1,
      color:'#fff',
       // padding:2,
      //  marginTop:8,
      //  marginBottom:10,
       width:'100%',
 
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
      justifyContent: 'center', // Center content horizontally
      alignItems: 'center', // Center content vertically
      paddingVertical: 3,
      borderBottomWidth: 1,
      borderColor: '#ccc',
    },
    userInfo: {
      flex: 1,
      justifyContent: 'center', // Center text horizontally
      alignItems: 'start', // Center text vertically
    },
    userInfoText: {
      textAlign: 'center', // Center text horizontally within userInfo
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center', // Center content vertically
    },
    actionButton: {
      paddingHorizontal: 0,
      paddingVertical: 2,
      marginLeft: 0,
    },
    actionButtonText: {
      color: 'white',
    },
});

export default DashboardList;
