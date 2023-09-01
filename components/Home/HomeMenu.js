import React from 'react';
import { View, StyleSheet, Text, ScrollView, StatusBar,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconA from 'react-native-vector-icons/AntDesign';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

export const HomeMenu = (props) => {
  const route = useRoute();
  const { category } = route.params;

  const getContentBasedOnCategory = () => {
    try {
    const categoriesPoster = [
        ['Glucometer Poster', 'Neuropathy Poster'],
        ['HbA1c Poster', 'BMD Poster'],
        ['Glucometer & Neuropathy Poster', ''] // The last category might not have a pair
      ];
      const categoriesReport = [
        ['Glucometer Report', 'Neuropathy Report'],
        ['HbA1c Report', 'BMD Report'],
        ['Glucometer & Neuropathy Report', ''] // The last category might not have a pair
      ];
    const categoriesDashboard = [
        ['Glucometer', 'Neuropathy'],
        ['HbA1c', 'BMD'],
        ['Glucometer & Neuropathy', ''] // The last category might not have a pair
      ];
  
    switch (category) {
        case 'Camp Poster':
            return (
                <ScrollView>
                    <View style={styles.container1}>
                {categoriesPoster.map((categoryPairPoster, index) => (
                  <View key={index} style={styles.row}>
                    {categoryPairPoster.map((catposter, innerIndex) => (
                      catposter !== '' && (
                        <LinearGradient
                          key={innerIndex} // Assigning a unique key
                          colors={['#4b93d8', '#0054a4']}
                          style={[styles.button, styles.elevation]}
                         
                        >
                          <TouchableOpacity key={catposter}  onPress={()=> props.navigation.navigate("PosterList")}>
                            <Text style={styles.buttonText}>{catposter}</Text>
                          </TouchableOpacity>
                        </LinearGradient>
                      )
                    ))}
                  </View>
                ))}
              </View>
        </ScrollView>
          );
        case 'Camp Report':
          return (
            <ScrollView>
            <View style={styles.container1}>
              {categoriesReport.map((categoryPairReport, index) => (
                <View key={index} style={styles.row}>
                  {categoryPairReport.map((catreport) => (
                    catreport !== '' && (
                      <LinearGradient
                        key={catreport} // Assigning a unique key
                        colors={['#4b93d8', '#0054a4']}
                        style={[styles.button, styles.elevation]}
                      >
                        <TouchableOpacity key={catreport}  onPress={()=> props.navigation.navigate("PosterList")}>
                          <Text style={styles.buttonText}>{catreport}</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    )
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
          );
        case 'Dashboard':
          return (
            <ScrollView>
            <View style={[styles.row, styles.container1]}>
              <TouchableOpacity style={[styles.button1, styles.elevation]}>
                <Text style={styles.buttonText1}>Total Camps: </Text>
                <Text style={styles.buttonText1}>10 </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button1, styles.elevation]}>
                <Text style={styles.buttonText1}>Total Doctors:</Text>
                <Text style={styles.buttonText1}>15 </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.container1}>
              {categoriesDashboard.map((categoryPairDash, index) => (
                <View key={index} style={styles.row}>
                  {categoryPairDash.map((catdash) => (
                    catdash !== '' && (
                      <LinearGradient
                        key={catdash} // Assigning a unique key
                        colors={['#4b93d8', '#0054a4']}
                        style={[styles.button, styles.elevation]}
                      >
                        <TouchableOpacity key={catdash}>
                          <Text style={styles.buttonText}>{catdash}</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    )
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
          );
        default:
          return 'No content available for this category.';
    }
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
    backgroundColor: '#0054a4',
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
    color: '#0054a4',
    fontSize: 20,
  },
  elevation: {
    elevation: 5 ,
    shadowColor: '#000',
  },
});

export default HomeMenu;
