import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import  Icon  from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';


function ProfileControls(props) {
    const [isDisable, setIsDisable] = useState(false);


    const shareProfileEventHandler = () => {
        setIsDisable(true);
        props.shareProfile();
    }

    const downloadCVEventHandler = () => {
        setIsDisable(true);
        props.downloadResume();
    }
    return (
        <View style={styles.controlContainer}>
            <View style={styles.downloadContainer}>
                <TouchableOpacity
                    style={styles.btnDownloadCV}
                    onPress={shareProfileEventHandler}
                    disabled={isDisable}
                    underlayColor="#ffffff"
                >
                    <Icon name="share-social" size={15} style={{ paddingTop: 2 }} />
                    <Text style={styles.btnDownloadCVText}>Share Profile</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.downloadContainer}>
                <Text style={{ paddingHorizontal: 10 }}>|</Text>
            </View>
            <View style={styles.downloadContainer}>
                <TouchableOpacity
                    style={styles.btnDownloadCV}
                    onPress={downloadCVEventHandler}
                    disabled={isDisable}
                    underlayColor="#ffffff"
                >
                    <MaterialCommunityIcons name="download" size={20} />
                    <Text style={styles.btnDownloadCVText}>Download</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ProfileControls;

const styles = StyleSheet.create({
    controlContainer: {
        backgroundColor: "#fff",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignSelf: 'center'
    },
    downloadContainer: {
        flexDirection: 'row'
    },
    btnDownloadCV: {
        flexDirection: 'row'
    },
    btnDownloadCVText: {
        color: '#EE699B',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
        paddingLeft: 5,
        fontSize: 14,
    }
});