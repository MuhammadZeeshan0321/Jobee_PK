import { View, Text, StyleSheet } from "react-native";

function ProfileSettingScreen () {
   return (
    <View style={ styles.root }>
        <Text>This is Profile-Setting Screen</Text>
    </View>
   );
}

export default ProfileSettingScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center'
    }
});