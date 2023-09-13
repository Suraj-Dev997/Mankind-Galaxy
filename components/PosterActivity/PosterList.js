import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image,TouchableOpacity } from 'react-native';
import { Button, Searchbar, IconButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../Configuration/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';



// Create separate components for each category's content
const CategoryPoster = ({ users, filteredUsers, renderUserItem }) => (
  <View style={styles.container}>
    <Header />
    <UserList filteredUsers={filteredUsers} renderUserItem={renderUserItem} />
  </View>
);

// Add more components for other categories as needed

const Header = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, name } = route.params;
  return(
    <View style={styles.headerMain}>
    <View style={styles.headertop}>
      <Button
        icon="plus"
        mode="contained"
        style={styles.addbtn}
        onPress={()=> navigation.navigate("UserProfileForm",{id})}
      >
        Add Doctor
      </Button>
    </View>
    <View style={styles.header}>
      <Searchbar
        placeholder="Search"
       
      />
    </View>
  </View>
  )
};



const UserList = ({ filteredUsers, renderUserItem }) => (
  <View style={styles.tableCont}>
    <TableHeader />
    <FlatList
  data={filteredUsers}
  renderItem={renderUserItem}
  keyExtractor={(item) => (item ? item.doctor_id.toString() : '0')} // Updated keyExtractor
/>
  </View>
);

const TableHeader = () => (
  <View style={styles.tableHeader}>
    <Text style={styles.columnHeader}>User info</Text>
    <Text style={styles.columnHeader}>Actions</Text>
  </View>
);

const PosterList = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]); // Store fetched data

  const onChangeSearch = (query) => setSearchQuery(query);
  const { id, name } = route.params;

  const handleEdit = (doctorId) => {
    navigation.navigate('UpdateUserProfileForm', { doctorId }); // Pass the doctorId as a parameter
  };

  const handleDelete = async (doctorId) => {
    try {
      const ApiUrl = `${BASE_URL}${'/doc/deleteDoctor'}`;
      const response = await fetch(ApiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctorId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Remove the deleted doctor from the state
        const updatedUsers = users.filter((user) => user.doctor_id !== doctorId);
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
        const ApiUrl = `${BASE_URL}${'/doc/getDoctorWithUserId'}`;
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
          setUsers(data[0]); // Set the fetched data
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
        console.log("Getting user id:",userId)
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

  

  // Filter users based on the search text
  const filteredUsers = users.filter((user) =>
    user.doctor_name.toLowerCase().includes(searchText.toLowerCase())
  );
  const ProfileUrl = `${BASE_URL}${'/uploads/profile/'}`;
  // Render user item
  const renderUserItem = ({ item }) => (
    
    <View style={styles.userItem}>
      <Image source={{ uri: ProfileUrl+item.doctor_img }} style={styles.userImage} />
      <View style={styles.userInfo}>
        <Text>{item.doctor_name}</Text>
        <Text>Date: {item.camp_date}</Text>
      </View>
      <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.actionButton}>
          <IconButton
            icon="file-image"
            iconColor="#0054a4"
            size={20}
            onPress={()=> navigation.navigate("PosterDownload")}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconButton
            icon="application-edit"
            iconColor="#0054a4"
            size={20}
            onPress={() => handleEdit(item.doctor_id)}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconButton
            icon="delete"
            iconColor="#0054a4"
            size={20}
            onPress={() => handleDelete(item.doctor_id)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <CategoryPoster users={users} filteredUsers={filteredUsers} renderUserItem={renderUserItem} />
  );
};

const styles = StyleSheet.create({
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
      // paddingHorizontal: 2,
      paddingVertical: 6,
      // borderRadius: 4,
      marginLeft: 1,
    },
    actionButtonText: {
      color: 'white',
    },
});

export default PosterList;