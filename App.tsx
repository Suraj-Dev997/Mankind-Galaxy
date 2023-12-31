/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet,View,Text} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { SplashScreen } from '../MankindGalaxy/components/SplashScreen/SplashScreen';
import { Home } from '../MankindGalaxy/components/Home/Home';
import { Login } from '../MankindGalaxy/components/Login/Login';
import Ham from '../MankindGalaxy/components/Layouts/Ham';
import { HomeMenu } from './components/Home/HomeMenu';
import PosterList from './components/PosterActivity/PosterList';
import ReportList from './components/CampReport/ReportList';
import DashboardList from './components/Dashboard/DashboardList';
import UserProfileForm from './components/PosterActivity/UserProfileForm';
import UpdateUserProfileForm from './components/PosterActivity/UpdateUserProfileForm';
import AddCampReport from './components/CampReport/AddCampReport';
import AddCampData from './components/CampReport/AddCampData';
import UploadCampImages from './components/CampReport/UploadCampImages';
import PosterDownload from './components/PosterActivity/PosterDownload';
import UpdateCampData from './components/CampReport/UpdateCampData';
import UpdateCampReport from './components/CampReport/UpdateCampReport';
import UpdateCampImages from './components/CampReport/UpdateCampImages';
import CampInfo from './components/CampReport/CampInfo';






const Stack = createNativeStackNavigator();
function App(): JSX.Element {
 

 
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Splash' screenOptions={{
     headerRight:()=><Ham/>,
      headerTintColor:"#fff", headerStyle:{
      backgroundColor:"#0047b9",  
    },
    }}>
       <Stack.Screen name='Home' component={Home} options={{title:"Mankind Galaxy",headerLeft:()=>
    <View><Text style={styles.dot}>.</Text></View>
    ,
    }} />
        <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
    {/* <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} /> */}
   
    <Stack.Screen name='Login' component={Login} options={{title:"User Login",headerShown: false }} />
    <Stack.Screen name='Ham' component={Ham} />
    <Stack.Screen name='HomeMenu' component={HomeMenu} options={{title:"Menu" }} /> 
    <Stack.Screen name='PosterList' component={PosterList} options={{title:"Doctors List" }} />
    <Stack.Screen name='ReportList' component={ReportList} options={{title:"Camp Report List" }} />
    <Stack.Screen name='DashboardList' component={DashboardList} options={{title:"Download Report" }} />
    <Stack.Screen name='UserProfileForm' component={UserProfileForm} options={{title:"Add Doctor" }} />
    <Stack.Screen name='UpdateUserProfileForm' component={UpdateUserProfileForm} options={{title:"Update Doctor" }} />
    <Stack.Screen name='AddCampReport' component={AddCampReport} options={{title:"Add Doctor Detail" }} />
    <Stack.Screen name='AddCampData' component={AddCampData} options={{title:"Add Camp Detail" }} />
    <Stack.Screen name='UploadCampImages' component={UploadCampImages} options={{title:"Add Camp Images" }} />
    <Stack.Screen name='UpdateCampReport' component={UpdateCampReport} options={{title:"Update Doctor Detail" }} />
    <Stack.Screen name='UpdateCampData' component={UpdateCampData} options={{title:"Update Camp Detail" }} />
    <Stack.Screen name='UpdateCampImages' component={UpdateCampImages} options={{title:"Update Camp Images" }} />
    <Stack.Screen name='PosterDownload' component={PosterDownload} options={{title:"Download Poster" }} />
    <Stack.Screen name='CampInfo' component={CampInfo} options={{title:"Camp Info" }} />
    
    </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  dot:{
    color:'#0047b9'
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
