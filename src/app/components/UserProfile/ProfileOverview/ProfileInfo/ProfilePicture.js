import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";

import { fonts } from "../../../../utility/auth";
import Icon from 'react-native-vector-icons/Ionicons';

function ProfilePicture({ SelectPhotoTypeEvent, closeModal }) {


    const selectPhotoType = (selectType) => {
        closeModal();
        SelectPhotoTypeEvent(selectType);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

            <View style={{ backgroundColor: 'white', margin: 10, padding: 15, borderRadius: 10, width: '90%', height: '30%' }}>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={closeModal} >
                        <Icon name="close" size={24} color="#00bac9" />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.mainHeading}>UPLOAD A PHOTO</Text>
                </View>

                <View style={styles.textcontainer}>
                    <View>
                        <TouchableOpacity
                            onPress={() => selectPhotoType('camera')} style={[styles.row, { paddingVertical: 10, paddingHorizontal: 20 }]}>
                            <Text style={{ color: '#00bac9', fontFamily: fonts.bold }}>Take a Photo</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => selectPhotoType('gallary')} style={[styles.row, { paddingTop: 10, paddingHorizontal: 20 }]}>
                            <Text style={{ color: '#00bac9', fontFamily: fonts.bold }}>Choose from Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </View>
    );
}

export default ProfilePicture;

const styles = StyleSheet.create({
    titleContainer: {
        marginHorizontal: 15,
        marginVertical: 10,
        alignItems: 'center'
    },
    mainHeading: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    textcontainer: {
        paddingLeft: 15,
        paddingRight: 15,
    },
});
