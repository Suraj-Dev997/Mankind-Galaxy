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

export const HomeMenu = (props) => {
  const route = useRoute();
  const { category } = route.params;
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    // Fetch subcategories from the API
    fetch('https://MankindGalexyapi.netcastservice.co.in/cat/getSubCategory')
      .then((response) => response.json())
      .then((data) => {
        // Extract subcategory names from the API response
        const subcategoryNames = data[0].map((subcategory) => subcategory.subcategory_name);
        setSubcategories(subcategoryNames);
      })
      .catch((error) => {
        console.error('Error fetching subcategories:', error);
      });
  }, []);

  const navigateToCategoryScreen = (subcategory) => {
    switch (category) {
      case 1:
        props.navigation.navigate('PosterList', { category: subcategory });
        break;
      case 2:
        props.navigation.navigate('ReportList', { category: subcategory });
        break;
      case 3:
        props.navigation.navigate('DashboardList', { category: subcategory });
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
          {subcategoryRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.container1}>
              {row.map((subcategory, subcategoryIndex) => (
                <LinearGradient
                  key={subcategory}
                  colors={['#4b93d8', '#0054a4']}
                  style={[
                    styles.button,
                    styles.elevation,
                    {
                      width: screenWidth / buttonsPerRow,
                    },
                  ]}
                >
                  <TouchableOpacity onPress={() => navigateToCategoryScreen(subcategory)}>
                    <Text style={styles.buttonText}>{subcategory}</Text>
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
    <LinearGradient colors={['#dffbfe', '#14bee1']} style={styles.container}>
      <StatusBar backgroundColor="#0054a4" />
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
    height: 100,
    textAlign: 'center',
    backgroundColor: '#0054a4',
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
  elevation: {
    elevation: 5,
    shadowColor: '#000',
  },
});

export default HomeMenu;
