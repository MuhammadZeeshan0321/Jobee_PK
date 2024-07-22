import { useState, useEffect, useRef } from 'react';
import {
    Text, StyleSheet, View, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView,
    Platform, FlatList
} from 'react-native';
import  Icon  from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';

import { fonts } from '../../../utility/auth';

const BasicProfileFiltersScreen = ({ PageTitle, ObjectVal, UpdateObjectState, canModify, closeModal }) => {
    const [profileFilterData, setProfileFilterData] = useState({
        isLoading: true,
        pageTitle: '',
        dataSource: [],
        canCustomAdd: false,
    });
    const [filterText, setFilterText] = useState('');
    const [arrayHolder, setArrayHolder] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        setProfileFilterData(prevState => ({
            ...prevState,
            canCustomAdd: canModify === undefined ? false : canModify,
            dataSource: ObjectVal ? ObjectVal : [],
            pageTitle: PageTitle
        }));
        setArrayHolder(ObjectVal);

        setProfileFilterData(prevState => ({
            ...prevState,
            isLoading: false,
        }));
    }, [ObjectVal, PageTitle, canModify]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const manageObjectInState = (objData) => {
        UpdateObjectState(profileFilterData.pageTitle, objData);
        closeModal();
    };

    const handleChange = (val) => {
        const newData = arrayHolder.filter((item) => {
            const itemData = item.Text.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setProfileFilterData(prevState => ({
            ...prevState,
            dataSource: newData
        }));
        setFilterText(val);
    }

    const addSearchCriterialHandler = () => {
        let data = filterText ? filterText.trim() : '';
        if (data === '') {
            return true;
        } else {
            const objData = {
                ID: 0,
                Text: filterText
            }
            UpdateObjectState(profileFilterData.pageTitle, objData);
            closeModal();
        }
    }


    const ListViewItemSeparator = () => (
        <View style={styles.separator} />
    );
    return (
        <View style={{ flex: 1 ,justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

            <View style={{ backgroundColor: 'white', margin: 10, padding: 15, borderRadius: 10, width: '90%', height: '90%' }}>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={closeModal} >
                        <Ionicons name="close" size={24} color="#00bac9" /></TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.mainHeading}>{profileFilterData.pageTitle}</Text>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

                    <View style={styles.textcontainer}>
                        <FlatList data={[1]} renderItem={({ item, index }) => {
                            return (
                                <View style={{ width: '100%', overflow: 'hidden' }}>
                                    {index == 0 &&
                                        <View>
                                            {profileFilterData.isLoading ? (
                                                <View style={{ flex: 1, paddingTop: 20 }}>
                                                    <ActivityIndicator />
                                                </View>
                                            ) : (
                                                <View style={styles.MainContainer}>
                                                    {profileFilterData.canCustomAdd ? (
                                                        <View style={styles.container}>
                                                            <View style={{ width: profileFilterData.dataSource.length === 0 ? '87%' : '100%' }}>
                                                                <TextInput
                                                                    ref={inputRef}
                                                                    style={[styles.TextInputStyleClass, { width: '100%' }]}
                                                                    maxLength={50}
                                                                    keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                                                                    onChangeText={text => handleChange(text)}
                                                                    value={filterText}
                                                                    underlineColorAndroid="transparent"
                                                                    placeholder="Search Here"
                                                                />
                                                            </View>
                                                            {profileFilterData.dataSource.length == 0 && (
                                                                <View style={{ margin: 5 }}>
                                                                    <TouchableOpacity onPress={() => addSearchCriterialHandler()}>
                                                                        <Icon name="checkmark-circle-outline" size={30} color="#1D8BDF" />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            )}
                                                        </View>
                                                    ) : (
                                                        <TextInput
                                                            ref={inputRef}
                                                            style={styles.TextInputStyleClass}
                                                            maxLength={100}
                                                            keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                                                            labelTextStyle={{ fontFamily: fonts.regular }}
                                                            titleTextStyle={{ fontFamily: fonts.regular }}
                                                            value={filterText}
                                                            onChangeText={text => handleChange(text)}
                                                            underlineColorAndroid="transparent"
                                                            placeholder="Search Here"
                                                        />
                                                    )}
                                                    <FlatList
                                                        data={profileFilterData.dataSource}
                                                        ItemSeparatorComponent={ListViewItemSeparator}
                                                        renderItem={({ item }) => (
                                                            <View key={item.ID}>
                                                                <TouchableOpacity
                                                                    style={styles.container}
                                                                    onPress={() => manageObjectInState(item)}
                                                                >
                                                                    <View>
                                                                        <Text style={styles.rowViewContainer}>{item.Text}</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                        )}
                                                        keyExtractor={item => item.ID.toString()}
                                                        style={{ flex: 1, marginTop: 10, backgroundColor: '#fff' }}
                                                    />
                                                </View>
                                            )}
                                        </View>
                                    }
                                </View>
                            )
                        }}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
};

export default BasicProfileFiltersScreen;

const styles = StyleSheet.create({
    titleContainer: {
        marginHorizontal: 20,
        alignItems: 'center'
    },
    mainHeading: {
        textAlign: 'center',
        fontSize: 24,
        marginBottom: 10,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
    },
    textcontainer: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        padding: 7,
        backgroundColor: '#fff'
    },
    rowViewContainer: {
        fontSize: 17,
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
        padding: 10
    },
    TextInputStyleClass: {
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? 'opensans' : 'opensans_regular',
        borderWidth: 1,
        borderColor: '#1D8BDF',
        borderRadius: 7,
        padding: 10
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        width: '100%',
        backgroundColor: '#9B9B9B',
    }
});