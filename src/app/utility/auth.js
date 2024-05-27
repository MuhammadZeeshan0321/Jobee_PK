import { Platform } from 'react-native';

export const fonts = {    
    regular: Platform.OS === 'ios'? 'opensans' : 'opensans_regular',    
    bold: Platform.OS === 'ios'? 'opensans-bold' : 'opensans_regular'//'opensans_bold',
}