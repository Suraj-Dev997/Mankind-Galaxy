import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity,ActivityIndicator } from 'react-native';
import { Button, Searchbar, IconButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../Configuration/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportList = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]); // Store fetched data
  const [isLoading, setIsLoading] = useState(true);

  const handleSearchTextChange = (query) => {
    setSearchText(query);
  };

  const { id } = route.params;
  const handleInfo = (crid) => {
    console.log('crid id',crid)
    navigation.navigate('CampInfo', { crId: crid,id }); // Pass the doctorId as a parameter
  };

  const handleEdit = (crid) => {
    console.log('crid id',crid)
    navigation.navigate('UpdateCampReport', { crId: crid,id }); // Pass the doctorId as a parameter
  };

  const handleDelete = async (crid) => {
    console.log("This g",crid)
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
        console.log("Delete Response",response)
        // Remove the deleted doctor from the state
        const updatedUsers = users.filter((user) => user.crid !== crid);
        setUsers(updatedUsers);
        console.log(data.message); // Log the success message
      } else {
        console.error('Error deleting doctor:', data);
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };


  // Fetch data from the API
  useEffect(() => {
    const fetchData = async (userId) => {
      try {
        setIsLoading(true);
        const ApiUrl = `${BASE_URL}${'/report/getAllCampReport'}`;
        const response = await fetch(ApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId, // Replace with your user ID
            subCatId: id, // Replace with your subcategory ID
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data[0]); 
          setIsLoading(false); // Set the fetched data
        } else {
          console.error('Error fetching data:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    AsyncStorage.getItem('userdata')
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data);
          const userId = userData.responseData.user_id;
          // Call fetchData with the retrieved userId
          console.log("Getting user id:", userId)
          fetchData(userId);
        } else {
          console.error('Invalid or missing data in AsyncStorage');
        }
      })
      .catch((error) => {
        console.error('Error retrieving data:', error);
      });

    fetchData();
  }, [id]);

  const TableHeader = () => (
    <View style={styles.tableHeader}>
    <Text style={styles.columnHeader}>Name</Text>
      <Text style={styles.columnHeader}>Date</Text>
      <Text style={styles.columnHeader}>Actions</Text>
    </View>
  );

  // Filter users based on the search text
  const filteredUsers = users.filter((user) =>
    searchText.length >= 3
      ? user.doctor_name?.toLowerCase().includes(searchText.toLowerCase())
      : true
  );
  const ProfileUrl = `${BASE_URL}${'/uploads/profile/'}`;

  // Render user item
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
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleInfo(item.crid)}
        >
          <IconButton icon="information-outline" iconColor="#0054a4" size={25} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconButton
            icon="square-edit-outline"
            iconColor="#0054a4"
            size={25}
            onPress={() => handleEdit(item.crid)}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconButton
            icon="delete-outline"
            iconColor="#0054a4"
            size={25}
            onPress={() => handleDelete(item.crid)}
          />
        </TouchableOpacity>
      </View>
    </View>
    )
    
};

  return (
    <View style={styles.container}>
      <View style={styles.headerMain}>
        <View style={styles.headertop}>
          <Button
            icon="plus"
            mode="contained"
            style={styles.addbtn}
            onPress={() => navigation.navigate("AddCampReport",{id})}
          >
              Add Report
          </Button>
        </View>
        <View style={styles.header}>
          <Searchbar
            placeholder="Search"
            onChangeText={handleSearchTextChange}
            value={searchText}
          />
        </View>
      </View>
      <View style={styles.tableCont}>
        <TableHeader />
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0054a4"/>
        </View>
          ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => (item ? item.crid.toString() : '0')} // Updated keyExtractor
        />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: '#0054a4',
    paddingLeft: 1,
    paddingRight: 1,
    color: 'white',
    marginTop: 8,
    marginBottom: 10,
    width: '42%',
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
    backgroundColor: '#0054a4',
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
