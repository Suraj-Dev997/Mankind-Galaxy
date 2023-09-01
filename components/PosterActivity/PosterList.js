import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image,TouchableOpacity } from 'react-native';
import { Button, Searchbar, IconButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

// Create separate components for each category's content
const CategoryPoster = ({ users, filteredUsers, renderUserItem }) => (
  <View style={styles.container}>
    <Header />
    <UserList filteredUsers={filteredUsers} renderUserItem={renderUserItem} />
  </View>
);

// Add more components for other categories as needed

const Header = () => (
  <View style={styles.headerMain}>
    <View style={styles.headertop}>
      <Button
        icon="plus"
        mode="contained"
        style={styles.addbtn}
        onPress={() => console.log('Pressed')}
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
);

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
    <Text style={styles.columnHeader}>User info</Text>
    <Text style={styles.columnHeader}>Actions</Text>
  </View>
);

const PosterList = () => {
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchText, setSearchText] = useState('');

  const onChangeSearch = (query) => setSearchQuery(query);

  let users = [];

  switch (route.params.category) {
    case 'Glucometer Poster':
      users = [
        {
          id: 1,
          name: 'John Doe - Glucometer',
          qualification: 'Doctor',
          image: 'https://zplusconnect.netcastservice.co.in/RDI.png',
        },
        {
          id: 2,
          name: 'Jane Smith - Glucometer',
          qualification: 'Engineer',
          image: 'https://zplusconnect.netcastservice.co.in/RDI.png',
        },
        // Add more users for Glucometer category as needed
      ];
      break;
    case 'Neuropathy Poster':
      users = [
        {
          id: 3,
          name: 'Alice - Neuropathy',
          qualification: 'Doctor',
          image: 'https://zplusconnect.netcastservice.co.in/img.jpg',
        },
        {
          id: 4,
          name: 'Bob - Neuropathy',
          qualification: 'Engineer',
          image: 'https://zplusconnect.netcastservice.co.in/img.jpg',
        },
        // Add more users for Neuropathy category as needed
      ];
      break;
      case 'HbA1c Poster':
      users = [
        {
          id: 3,
          name: 'Alice - HbA1c',
          qualification: 'Doctor',
          image: 'https://zplusconnect.netcastservice.co.in/img.jpg',
        },
        {
          id: 4,
          name: 'Bob - HbA1c',
          qualification: 'Engineer',
          image: 'https://zplusconnect.netcastservice.co.in/img.jpg',
        },
        // Add more users for Neuropathy category as needed
      ];
      break;
      case 'BMD Poster':
      users = [
        {
          id: 3,
          name: 'Alice - BMD',
          qualification: 'Doctor',
          image: 'https://zplusconnect.netcastservice.co.in/img.jpg',
        },
        {
          id: 4,
          name: 'Bob - BMD',
          qualification: 'Engineer',
          image: 'https://zplusconnect.netcastservice.co.in/img.jpg',
        },
        // Add more users for Neuropathy category as needed
      ];
      break;
      case 'Glucometer & Neuropathy Poster':
      users = [
        {
          id: 3,
          name: 'Alice - Glucometer & Neuropathy',
          qualification: 'Doctor',
          image: 'https://zplusconnect.netcastservice.co.in/img.jpg',
        },
        {
          id: 4,
          name: 'Bob - Glucometer & Neuropathy',
          qualification: 'Engineer',
          image: 'https://zplusconnect.netcastservice.co.in/img.jpg',
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
      <Image source={{ uri: item.image }} style={styles.userImage} />
      <View style={styles.userInfo}>
        <Text>{item.name}</Text>
        <Text>{item.qualification}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <IconButton
            icon="file-image"
            iconColor="#0054a4"
            size={20}
            onPress={() => console.log('Pressed')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconButton
            icon="application-edit"
            iconColor="#0054a4"
            size={20}
            onPress={() => console.log('Pressed')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconButton
            icon="delete"
            iconColor="#0054a4"
            size={20}
            onPress={() => console.log('Pressed')}
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
