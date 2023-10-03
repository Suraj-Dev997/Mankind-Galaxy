import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from '../Configuration/Config';

export const HomeMenu = (props) => {
  const route = useRoute();
  const { category } = route.params;

  const [categoriesPoster, setCategoriesPoster] = useState([]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        // Make an API call to get subcategories based on the selected category
        const categoryId = category; // Replace with the appropriate categoryId for 'Camp Poster'
        const API_PATH = '/cat/getSubCategory';
        const ApiUrl = `${BASE_URL}${API_PATH}/${categoryId}`;
        const response = await fetch(ApiUrl);
        const data = await response.json();
        console.log("Subcategories id",category)

        if (Array.isArray(data) && data.length > 0) {
          // Assuming the subcategories are in the first element of the array
          const subcategories = data[0];
          setCategoriesPoster(subcategories);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
  }, [category]);

  const renderCategoriesPoster = () => {
    const rows = [];
    const itemsPerRow = 2; // Number of items per row
  
    for (let i = 0; i < categoriesPoster.length; i += itemsPerRow) {
      const rowItems = categoriesPoster.slice(i, i + itemsPerRow);
  
      const row = (
        
        <View key={i} style={styles.row}>
          {rowItems.map((subcategory) => (
            <LinearGradient
              key={subcategory.subcategory_id}
              colors={['#4b93d8', '#0047b9']}
              style={[styles.button, styles.elevation]}
            >
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('PosterList', { category: subcategory.subcategory_id })
                }
              >
                <Text style={styles.buttonText}>{subcategory.subcategory_name}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>
      );
  
      rows.push(row);
    }
  
    return (
      
        <View  style={styles.container1}>{rows}</View>
      
    );
  };
  
  return (
    <LinearGradient colors={['#dffbfe', '#14bee1']} style={styles.container}>
      <StatusBar backgroundColor="#0047b9" />
    {renderCategoriesPoster()}
      
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',  
    
    },
    container1: {
      padding: 10,
      
      justifyContent: 'center',
      alignItems: 'center', // To center horizontally if needed
    },
    row: {
      flexDirection: 'row',
      marginBottom: 6,
    },
button: {
  flex: 1,
  marginHorizontal: 3,
  height: 100,
  textAlign:'center',
  backgroundColor: '#0047b9',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius:20,

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
image: {
  width: '100%',
  height: 140,
  // borderRadius:10,
  marginBottom:6,

},
buttonText: {
  textAlign:'center',
  color: 'white',
  fontSize: 19,
 
},
buttonText1: {
  textAlign:'center',
  color: '#0047b9',
  fontSize: 20,
},
elevation: {
  elevation: 5 ,
  shadowColor: '#000',
},
});

export default HomeMenu;
