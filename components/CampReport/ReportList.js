import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Searchbar, IconButton} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL} from '../Configuration/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useNetworkStatus from '../useNetworkStatus';
import {useFocusEffect} from '@react-navigation/native';

const ReportList = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]); // Store fetched data
  const [isLoading, setIsLoading] = useState(true);
  const isConnected = useNetworkStatus();
  const {id, loadData} = route.params;

  useFocusEffect(
    useCallback(() => {
      if (loadData) {
        fetchData();
      }
    }, [loadData]),
  );

  useEffect(() => {
    if (!isConnected) {
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    }
  }, [isConnected]);

  const handleSearchTextChange = query => {
    setSearchText(query);
  };

  const handleInfo = crid => {
    console.log('crid id', crid);
    navigation.navigate('CampInfo', {crId: crid, id}); // Pass the doctorId as a parameter
  };

  const handleEdit = crid => {
    console.log('crid id', crid);
    navigation.navigate('UpdateCampReport', {crId: crid, id}); // Pass the doctorId as a parameter
  };

  const handleDelete = async crid => {
    setIsLoading(true);
    console.log('This g', crid);
    try {
      const ApiUrl = `${BASE_URL}${'/report/deleteReportWithId'}`;
      const response = await fetch(ApiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crId: crid,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Delete Response', response);
        // Remove the deleted doctor from the state
        const updatedUsers = users.filter(user => user.crid !== crid);
        setUsers(updatedUsers);
        console.log(data.message); // Log the success message
        fetchData();
        setIsLoading(false);
      } else {
        console.error('Error deleting doctor:', data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await AsyncStorage.getItem('userdata');
  //       if (data) {
  //         const userData = JSON.parse(data);
  //         const userId = userData.responseData.user_id;
  //         console.log('user id', userId);
  //         console.log('subcat id', id);
  //         // Fetch data from the API using the retrieved userId
  //         const ApiUrl = `${BASE_URL}${'/report/getAllCampReport'}`;
  //         const response = await fetch(ApiUrl, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             userId: userId, // Use the retrieved userId
  //             subCatId: id, // Replace with your subcategory ID
  //           }),
  //         });
  //         const responseData = await response.json();
  //         setUsers(responseData[0]);
  //         setIsLoading(false);
  //       } else {
  //         console.log('Invalid or missing data in AsyncStorage');
  //         setIsLoading(false);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data: ', error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData(); // Call the fetchData function once when the component mounts
  // }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await AsyncStorage.getItem('userdata');
      if (data) {
        const userData = JSON.parse(data);
        const userId = userData.responseData.user_id;
        console.log('user id', userId);
        console.log('subcat id', id);
        // Fetch data from the API using the retrieved userId
        const ApiUrl = `${BASE_URL}${'/report/getAllCampReport'}`;
        const response = await fetch(ApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId, // Use the retrieved userId
            subCatId: id, // Replace with your subcategory ID
          }),
        });
        const responseData = await response.json();
        setUsers(responseData[0]);
        setIsLoading(false);
      } else {
        console.log('Invalid or missing data in AsyncStorage');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Call the fetchData function once when the component mounts or when 'id' changes
  }, [id]);

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.columnHeader}>Name</Text>
      <Text style={styles.columnHeader}>Date</Text>
      <Text style={styles.columnHeader}>Actions</Text>
    </View>
  );

  // Filter users based on the search text
  const filteredUsers = users.filter(user =>
    searchText.length >= 3
      ? user.doctor_name?.toLowerCase().includes(searchText.toLowerCase())
      : true,
  );
  const ProfileUrl = `${BASE_URL}${'/uploads/profile/'}`;

  // Render user item
  const renderUserItem = ({item}) => {
    const campDate = new Date(item.camp_date);

    // Define date options for formatting
    const dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    // Format the date using toLocaleDateString
    const formattedDate = campDate.toLocaleDateString('en-US', dateOptions);
    return (
      <View style={styles.userItem}>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>{item.doctor_name}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}> {formattedDate}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleInfo(item.crid)}>
            <IconButton icon="information" iconColor="#0a94d6" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconButton
              icon="square-edit-outline"
              iconColor="#222"
              size={20}
              onPress={() => handleEdit(item.crid)}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconButton
              icon="delete"
              iconColor="#dc222d"
              size={20}
              onPress={() => handleDelete(item.crid)}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerMain}>
        <View style={styles.headertop}>
          <LinearGradient colors={['#0047b9', '#0c93d7']} style={styles.addbtn}>
            <Button
              icon="plus"
              elevation={4}
              // mode="contained"
              style={styles.addbtn1}
              labelStyle={styles.addbtnText}
              onPress={() => navigation.navigate('AddCampReport', {id})}>
              Add Report
            </Button>
          </LinearGradient>
        </View>
        <View style={styles.header}>
          <Searchbar
            placeholder="Search"
            onChangeText={handleSearchTextChange}
            value={searchText}
            style={styles.searchbarStyle}
          />
        </View>
      </View>
      <View style={styles.tableCont}>
        <TableHeader />
        {isLoading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#0047b9" />
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={item => (item ? item.crid.toString() : '0')} // Updated keyExtractor
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchbarStyle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0047b9',
  },
  container: {
    backgroundColor: '#daf5ff',
    flex: 1,
  },
  headerMain: {
    padding: 16,
  },
  headertop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addbtn: {
    backgroundColor: '#0047b9',
    paddingLeft: 1,
    paddingRight: 1,
    color: '#fff',
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 50,
    width: '42%',
  },

  addbtnText: {
    color: '#fff', // Set the text color here
  },
  tableCont: {
    margin: 5,
    padding: 16,
    marginTop: 5,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#0047b9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    color: '#fff',
    textAlign: 'center',
  },
  columnHeader: {
    textAlign: 'center',
    color: '#fff',
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
  userInfoText: {
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingVertical: 6,
    marginLeft: 1,
  },
  actionButtonText: {
    color: 'white',
  },
});

export default ReportList;
