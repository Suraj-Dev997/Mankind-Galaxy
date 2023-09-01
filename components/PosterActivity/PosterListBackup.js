import React, { useState } from 'react';
import {View,Text,TextInput, FlatList,Image,TouchableOpacity,StyleSheet,} from 'react-native';
import { Button } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

const PosterList = () => {
  const route = useRoute();
  const { category } = route.params;

    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      qualification: 'Doctor',
      image: 'https://zplusconnect.netcastservice.co.in/RDI.png',
    },
    {
      id: 2,
      name: 'Jane Smith',
      qualification: 'Engineer',
      image: 'https://zplusconnect.netcastservice.co.in/RDI.png',
    },
    // Add more user objects here
  ]);
  
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
    iconColor='#0054a4'
    size={20}
    onPress={() => console.log('Pressed')}
  />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
      <IconButton
    icon="application-edit"
    iconColor='#0054a4'
    size={20}
    onPress={() => console.log('Pressed')}
  />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
      <IconButton
    icon="delete"
    iconColor='#0054a4'
    size={20}
    onPress={() => console.log('Pressed')}
  
  />
      </TouchableOpacity>
    </View>
  </View>
  );
  // Define different content based on the category
  let content = null;

  switch (category) {
    case "Glucometer Poster":
      content = (
        
<View style={styles.container} >
      <View  style={styles.headerMain}>
      <View style={styles.headertop}>  
       <Button icon="plus" mode="contained"  style={ styles.addbtn } onPress={() => console.log('Pressed')}>
    Add Doctor
  </Button>
  </View>
      
      <View style={styles.header}>
      <Searchbar
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}
    />
      </View>
      </View>
       
      <View style={styles.tableCont}>
      <View style={styles.tableHeader}>
     
     <Text style={styles.columnHeader}>User info</Text>
    
     <Text style={styles.columnHeader}>Actions</Text>
   </View>
   <FlatList
     data={filteredUsers}
     renderItem={renderUserItem}
     keyExtractor={(item) => item.id.toString()}
   />
      </View>
      
    </View>
      );
      break;
    case "Neuropathy Poster":
      content = (
        <View style={styles.container}>
        <View  style={styles.headerMain}>
        <View style={styles.headertop}>  
         <Button icon="plus" mode="contained"  style={ styles.addbtn } onPress={() => console.log('Pressed')}>
      Add Doctor
    </Button>
    </View>
        
        <View style={styles.header}>
        <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
        </View>
        </View>
         
        <View style={styles.tableCont}>
        <View style={styles.tableHeader}>
       
       <Text style={styles.columnHeader}>User info</Text>
      
       <Text style={styles.columnHeader}>Actions</Text>
     </View>
     <FlatList
       data={filteredUsers}
       renderItem={renderUserItem}
       keyExtractor={(item) => item.id.toString()}
     />
        </View>
        
      </View>
      );
      break;
    // Add cases for other categories

    default:
      content = <Text>No content available for this category.</Text>;
  }
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

 

  return (
    <View style={styles.container}>
    {/* Other components or layouts */}
    {content}
  </View>
    
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
