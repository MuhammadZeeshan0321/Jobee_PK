import { View, Text, StyleSheet } from "react-native";

function MyProfileScreen () {
   return (
    <View style={ styles.root }>
        <Text>This is My-Profile Screen</Text>
    </View>
   );
}

export default MyProfileScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center'
    }
});