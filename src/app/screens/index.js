
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignupScreen from './SignUp/SignUp';

const Stack = createNativeStackNavigator();

function RegisterScreens() {

    // return (
    //     <Stack.Navigator>
    //         <Stack.Screen name='Signup' component={SignupScreen}
    //             options={{
    //                 presentation: 'modal'
    //             }}
    //         />
    //     </Stack.Navigator>
    // );
}

export default RegisterScreens;