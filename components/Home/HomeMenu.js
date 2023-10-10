import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from '../Configuration/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HomeMenu = (props) => {
  const route = useRoute();
  const { category } = route.params;
  const [subcategories, setSubcategories] = useState([]);
  const [totalCamps, setTotalCamps] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  

  const fetchTotalCamps = async (userId) => {
    try {
      const ApiUrl = `${BASE_URL}${'/dashboard/getTotalCamps'}`;
      const response = await fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // You can change the user ID as needed
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const campCount = data[0].camp_count;
          setTotalCamps(campCount);
        }
      } else {
        console.error('Failed to fetch Total Camps data');
      }
    } catch (error) {
      console.error('Error fetching Total Camps data:', error);
    }
  };

  AsyncStorage.getItem('userdata')
  .then((data) => {
    if (data) {
      const userData = JSON.parse(data);
      const userId = userData.responseData.user_id;
      // Call fetchData with the retrieved userId
    
      fetchTotalCamps(userId);
    } else {
      console.error('Invalid or missing data in AsyncStorage');
    }
  })
  .catch((error) => {
    console.error('Error retrieving data:', error);
  });

  useEffect(() => {
    fetchTotalCamps();
  }, []);

  const fetchTotalDoctors = async (userId) => {
    try {
      const ApiUrl = `${BASE_URL}${'/dashboard/getTotalDoctors'}`;
      const response = await fetch(ApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // You can change the user ID as needed
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const docCount = data[0].doc_count;
          setTotalDoctors(docCount);
        }
      } else {
        console.error('Failed to fetch Total Doctors data');
      }
    } catch (error) {
      console.error('Error fetching Total Doctors data:', error);
    }
  };
  AsyncStorage.getItem('userdata')
  .then((data) => {
    if (data) {
      const userData = JSON.parse(data);
      const userId = userData.responseData.user_id;
      // Call fetchData with the retrieved userId
     
      fetchTotalDoctors(userId);
    } else {
      console.error('Invalid or missing data in AsyncStorage');
    }
  })
  .catch((error) => {
    console.error('Error retrieving data:', error);
  });

  useEffect(() => {
    fetchTotalDoctors();
  }, []);

  useEffect(() => {
    // Fetch subcategories from the API
    const ApiUrl = `${BASE_URL}${'/cat/getSubCategory'}`;
    fetch(ApiUrl)
      .then((response) => response.json())
      .then((data) => {
   
        console.log(data)
        const subcategoryData = data[0].map((subcategory) => ({
          id: subcategory.subcategory_id,
          name: subcategory.subcategory_name,
        }));
        setSubcategories(subcategoryData);
      })
      .catch((error) => {
        console.error('Error fetching subcategories:', error);
      });
  }, []);

  const navigateToCategoryScreen = (id, name) => {
    switch (category) {
      case 1:
        props.navigation.navigate('PosterList', { id, name });
        break;
      case 2:
        props.navigation.navigate('ReportList', { id, name });
        break;
      case 3:
        props.navigation.navigate('DashboardList', { id, name });
        break;
      default:
        break;
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const buttonsPerRow = 2;

  const getContentBasedOnCategory = () => {
    try {
      const subcategoryRows = [];
      for (let i = 0; i < subcategories.length; i += buttonsPerRow) {
        const rowSubcategories = subcategories.slice(i, i + buttonsPerRow);
        subcategoryRows.push(rowSubcategories);
      }

      return (
        <ScrollView>
          {/* Static buttons for the DashboardList category */}
          {category === 3 && (
            <View style={styles.container1}>
              <LinearGradient
                colors={['#EDF5F0', '#D8DEDA']}
                style={[
                  styles.button1,
                 
                  {
                    width: screenWidth / buttonsPerRow,
                  },
                ]}
              >
                <TouchableOpacity onPress={() => console.log('Button 1 clicked')}>
                  <Text style={styles.buttonText1}>Total Camps: </Text>
                  <Text style={styles.buttonText1}>{totalCamps} </Text>
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={['#EDF5F0', '#D8DEDA']}
                style={[
                  styles.button1,
                
                  {
                    width: screenWidth / buttonsPerRow,
                  },
                ]}
              >
                <TouchableOpacity onPress={() => console.log('Button 2 clicked')}>
                  <Text style={styles.buttonText1}>Total Doctors: </Text>
                  <Text style={styles.buttonText1}>{totalDoctors} </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}
       {subcategoryRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.container1}>
              {row.map((subcategory, subcategoryIndex) => (
                <LinearGradient
                  key={subcategory.id}
                  colors={['#0047b9', '#0c93d7']}
                  style={[
                    styles.button,
                    styles.elevation,
                    {
                      width: screenWidth / buttonsPerRow,
                    },
                  ]}
                  onTouchStart={() => navigateToCategoryScreen(subcategory.id, subcategory.name)} // Use onTouchStart for touch event
                >
                  <TouchableOpacity >
                    <Text style={styles.buttonText}>{subcategory.name}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              ))}
            </View>
          ))}
        </ScrollView>
      );
    } catch (error) {
      console.error('Error generating content:', error);
      return 'An error occurred while generating content.';
    }
  };

  return (
    <LinearGradient  colors={[  '#daf5ff','#72c5f8']} style={styles.container}>
      <StatusBar backgroundColor="#0047b9" />
      <View>{getContentBasedOnCategory()}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  container1: {
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    marginHorizontal: 3,
    height: 90,
    textAlign: 'center',
    backgroundColor: '#0047b9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 19,
  },
  button1: {
    flex: 1,
    marginHorizontal: 10,
    height: 80,
borderWidth:2,
borderColor: '#72c5f8',
    textAlign: 'center',
    // backgroundColor: '#0047b9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText1: {
    textAlign: 'center',
    color: '#0047b9',
    fontSize: 15,
  },
  elevation: {
    elevation: 5,
    shadowColor: '#000',
  },
});

export default HomeMenu;
