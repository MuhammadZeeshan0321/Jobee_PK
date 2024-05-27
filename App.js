/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import EvilIcons from '@expo/vector-icons/EvilIcons';

import FindJobsScreen from './src/app/screens/FindJobs/FindJobsScreen';
import ApplicationsScreen from './src/app/screens/Applications/Applications';
import MyProfileScreen from './src/app/screens/MyProfile/MyProfile';
import ProfileSettingScreen from './src/app/screens/ProfileSetting/ProfileSetting';
import { fonts } from './src/app/utility/auth';


const Tab = createBottomTabNavigator();

function App() {
  return (
    <>
      <StatusBar style='light' backgroundColor='#00bac9' />
      <NavigationContainer>
        <Tab.Navigator screenOptions={
          {
            headerStyle: { backgroundColor: '#00bac9' },
            headerTitleAlign: 'center',
            headerTintColor: 'white',
            tabBarActiveTintColor: '#00bac9',
            tabBarStyle: { fonts: fonts.regular },
            // tabBarHidden: false,    // these opitons are in old projects
            // tabBarTranslucent: false,
            // forceTitlesDisplay: true,
            // tabBarHideShadow: true
          }
        }>
          <Tab.Screen name='FindJobs' component={FindJobsScreen}
            options={{
              headerShown: false,
              tabBarLabel: 'Find Jobs',
              tabBarIcon: ({ size, color }) => (
                <Ionicons name="briefcase" size={size} color={color} />
              )
            }} />
          <Tab.Screen name='Applications' component={ApplicationsScreen}
            options={{
              tabBarLabel: 'Applications',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name='newspaper' size={size} color={color} />
              )
            }} />
          <Tab.Screen name='MyProfile' component={MyProfileScreen} sett
            options={{
              title: 'My Profile',
              tabBarLabel: 'My Profile',
              tabBarIcon: ({ color }) => (
                <EvilIcons name='user' size={34} color={color} />
              )
            }} />
          <Tab.Screen name='ProfileSetting' component={ProfileSettingScreen}
            options={{
              title: 'Settings',
              tabBarLabel: 'Settings',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name='settings-sharp' size={size} color={color} />
              )
            }} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
