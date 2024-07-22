import { View, Text, Image, TouchableOpacity } from 'react-native';

import { fonts } from '../../utility/auth';
import { styles } from '../../../assets/css/styles';

function DefaultScreen(props) {
    return (
        <View style={{ marginHorizontal: 20, marginTop: '10%' }}>
            <View style={[styles.centerRow, { marginVertical: 10 }]}>
                <Image style={{ width: 120, height: 120 }} source={props.imagePath} />
            </View>
            <View>
                <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular, paddingVertical: 10 }]}>
                    {props.menuText}
                </Text>
            </View>
            <View>
                <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular }]}>
                    {props.profileInstraction}
                </Text>
            </View>
            <View>
                <View style={[styles.centerAlign, { marginVertical: 20 }]}>
                    <TouchableOpacity onPress={props.buttonEvent} style={{ width: '60%', paddingVertical: 10, backgroundColor: '#00bac9', borderRadius: 30, }}>
                        <Text style={[styles.whiteLightText, styles.centerText, { fontFamily: fonts.regular }]}>
                            Sign up
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular }]}>
                    Already have an account?
                </Text>
                <View style={[styles.centerAlign, { marginVertical: 3 }]}>
                    <TouchableOpacity onPress={props.signinButtonEvent} style={{ borderBottomWidth: 1, borderBottomColor: '#00bac9', }}>
                        <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular, color: '#00bac9', }]}>
                            Sign in
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default DefaultScreen;