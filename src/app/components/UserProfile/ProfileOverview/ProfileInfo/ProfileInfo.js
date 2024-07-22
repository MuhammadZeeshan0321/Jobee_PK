import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function ProfileInfo(props) {

    return (
        <View style={styles.profileContainer}>
            <View>
                <Text numberOfLines={1} style={styles.profileDesignation}>{props.companyName}</Text>
                <Text style={styles.profileExperience}>{props.companyName === '' ? '' : props.experience} </Text>
            </View>
            <Text numberOfLines={2} style={styles.profileName}>{props.name === "undefined undefined" ? '' : props.name}</Text>
            <View style={styles.headercontainer}>
                <Text numberOfLines={1} style={styles.profileAddress}>{props.address === ", " ? '' : props.address}</Text>
                <TouchableOpacity onPress={props.buttonEvent} disabled={props.isDisabled}>
                    {/* <Text style={styles.buttonText}>Edit</Text> */}
                    <MaterialIcons name="create" size={22} color='#fff' />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ProfileInfo;

const styles = StyleSheet.create({
    profileContainer: {
        padding: Platform.OS === 'ios' ? 8 : 5,
    },
    profileName: {
        color: "#fff",
        fontSize: 16,
        width: '70%',
        paddingVertical: 3,
        fontFamily: Platform.OS === 'ios' ? 'opensans_regular' : 'opensans_regular',
    },
    profileDesignation: {
        fontSize: 12,
        color: '#fff',
        width: '100%',
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    profileExperience: {
        fontSize: 12,
        color: "#fff",
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    profileAddress: {
        fontSize: 12,
        color: "#fff",
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    headercontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%'
    },
    buttonText: {
        fontSize: 16,
        color: '#007aff',
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    }
});