/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { StatusBar, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import EvilIcons from '@expo/vector-icons/EvilIcons';

import FindJobsScreen from './src/app/screens/FindJobs/FindJobsScreen';
import ApplicationsScreen from './src/app/screens/Applications/Applications';
import MyProfileScreen from './src/app/screens/MyProfile/MyProfile';
import ProfileSettingScreen from './src/app/screens/ProfileSetting/ProfileSetting';
import { fonts } from './src/app/utility/auth';
import SignupScreen from './src/app/screens/SignUp/SignUp';
import { styles } from './src/assets/css/styles';
import SignInScreen from './src/app/screens/SignIn/SignIn';
import BasicProfileScreen from './src/app/screens/BasicProfile/BasicProfile';
import AppContextProvider from './src/app/store/app-context';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainScreens() {

  return (
    <Tab.Navigator screenOptions={
      {
        headerStyle: { backgroundColor: '#00bac9' },
        headerTitleAlign: 'center',
        headerTintColor: 'white',
        tabBarActiveTintColor: '#00bac9',
        tabBarStyle: { fonts: fonts.regular }
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
          headerShown: false,
          tabBarLabel: 'My Profile',
          tabBarIcon: ({ color }) => (
            <EvilIcons name='user' size={34} color={color} />
          ),
        }}
      />
      <Tab.Screen name='ProfileSetting' component={ProfileSettingScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='settings-sharp' size={size} color={color} />
          )
        }} />
    </Tab.Navigator>
  );

}

function Root() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='MainScreens' component={MainScreens}
          options={{
            headerShown: false
          }} />
        <Stack.Screen name='Signup' component={SignupScreen}
          options={{
            title: 'Sign Up',
            presentation: 'modal',
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: 'white' },
            headerTitleStyle: [styles.heading, { fontFamily: fonts.bold }],
            headerTransparent: 'true',
            contentStyle: { backgroundColor: 'white' }
          }}
        />
        <Stack.Screen name='Signin' component={SignInScreen}
          options={{
            // title: 'Sign In',
            headerTitle: () => (
              <Image
                source={require('./src/assets/img/bee_main_logo_sm.png')} // Change this to your image path
                style={styles.headerImage}
              />
            ),
            presentation: 'modal',
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: 'white' },
            headerTitleStyle: [styles.heading, { fontFamily: fonts.bold }],
            headerTransparent: 'true',
            contentStyle: { backgroundColor: 'white' }
          }}
        />
        <Stack.Screen name='BasicProfile' component={BasicProfileScreen}
          options={{
            // title: 'Basic Profile',
            presentation: 'modal',
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: 'white' },
            headerTitleStyle: [styles.heading, { fontFamily: fonts.bold }],
            headerTransparent: 'true',
            contentStyle: { backgroundColor: 'white' },
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {

  return (
    <>
      <StatusBar style='light' backgroundColor='#00bac9' />
      <AppContextProvider>
        <Root />
      </AppContextProvider>
    </>
  );
}

export default App;
