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






const Stack = createNativeStackNavigator();
function App(): JSX.Element {
 

 
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Splash' screenOptions={{
     headerRight:()=><Ham/>,
      headerTintColor:"#fff", headerStyle:{
      backgroundColor:"#0054a4",  
    },
    }}>
       <Stack.Screen name='Home' component={Home} options={{title:"Mankind",headerLeft:()=>
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
    <Stack.Screen name='HomeMenu' component={HomeMenu} />
    
    </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  dot:{
    color:'#0054a4'
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
