import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image,TouchableOpacity,Modal } from 'react-native';
import { Button, Searchbar, IconButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

// Create separate components for each category's content
const CategoryReport = ({ users, filteredUsers, renderUserItem }) => (
    <View style={styles.container}>
      <Header />
      <UserList filteredUsers={filteredUsers} renderUserItem={renderUserItem} />
    </View>
  );
  
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
      <Text style={styles.columnHeader}>Name</Text>
      <Text style={styles.columnHeader}>Date</Text>
      <Text style={styles.columnHeader}>Actions</Text>
    </View>
  );
  
  const ReportList = () => {
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
    case 'Glucometer Report':
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
    case 'Neuropathy Report':
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
      case 'HbA1c Report':
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
      case 'BMD Report':
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
      case 'Glucometer & Neuropathy Report':
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
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleInfoButtonClick(item)}
        >
          <IconButton icon="information" iconColor="#0054a4" size={20} />
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
    <CategoryReport
      users={users}
      filteredUsers={filteredUsers}
      renderUserItem={renderUserItem}
    />
  );
};

const styles = StyleSheet.create({
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

export default ReportList;
