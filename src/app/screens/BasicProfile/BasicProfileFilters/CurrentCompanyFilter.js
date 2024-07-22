import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AutocompleteInput from 'react-native-autocomplete-input';
import { Ionicons } from '@expo/vector-icons';

import companiesList from '../../../../assets/data/companiesList.json';
import { styles } from '../../../../assets/css/styles';
import { fonts } from '../../../utility/auth';

const CurrentCompanyFiltersScreen = ({ PageTitle, ObjectVal, UpdateObjectState, canModify, closeModal }) => {
    const [selectedItem, setSelectedItem] = useState({
        Id: 0,
        name: '',
    });
    const [CompanySuggestions, setCompanySuggestions] = useState([]);
    const [pageTitle, setPageTitle] = useState('Current Company');

    useEffect(() => {
        setCompanySuggestions(companiesList);
        if (ObjectVal === undefined || ObjectVal.ID === undefined) {
            setPageTitle(PageTitle);
        } else {
            setSelectedItem(prevState => ({
                ...prevState,
                Id: ObjectVal.ID,
                name: ObjectVal.Text,
            }));
            setPageTitle(PageTitle);
        }
    }, [])

    const findCompany = (companyName) => {
        const invalid = /[°"§%()\[\]{}=\\?´`'#<>|,;.:+_-]+/g;
        companyName = companyName.replace(invalid, "");
        if (companyName === '') {
            return [];
        }

        const regex = new RegExp(`${companyName.trim()}`, 'i');
        // return CompanySuggestions.filter(item => item.name.toLowerCase().includes(companyName.toLowerCase()))
        return CompanySuggestions.filter(company => company.name.search(regex) >= 0);
    };


    const handleSelectItem = (item) => {
        setSelectedItem({
            Id: item.id,
            name: item.name,
        });
    };


    const handleAdd = () => {
        if (selectedItem.name.trim() === '') {
            return true;
        } else {
            const selectedObj = {
                ID: selectedItem.Id,
                Text: selectedItem.name.trim()
            };
            UpdateObjectState(pageTitle, selectedObj);
            closeModal();
        }
    };

    const renderItem = useCallback(({ item }) => (
        <ScrollView keyboardShouldPersistTaps='always'>
            <TouchableOpacity onPress={() => handleSelectItem(item)} style={{ width: '100%', height: '100%' }}>
                <Text style={[styles.whiteLightText, compStyles.renderList]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    ), []);

    const { name } = selectedItem;
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

            <View style={{ backgroundColor: 'white', margin: 10, padding: 15, borderRadius: 10, width: '90%', height: '90%' }}>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={closeModal} >
                        <Ionicons name="close" size={24} color="#00bac9" /></TouchableOpacity>
                </View>
                <View style={compStyles.titleContainer}>
                    <Text style={compStyles.mainHeading}>{pageTitle}</Text>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <View style={[styles.spacebetweenRow, { height: '100%' }]}>
                        <View style={{ flex: 1, width: '85%', height: '100%', marginHorizontal: 10, padding: 5, backgroundColor: '#ffffff' }}>

                            <AutocompleteInput
                                inputContainerStyle={{ borderWidth: 0, borderBottomWidth: 1 }}
                                listContainerStyle={[styles.autocompleteContainer, { flex: 1, marginBottom: 80 }]}
                                listStyle={{ borderWidth: 0 }}
                                underlineColorAndroid='transparent'
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={{ fontFamily: fonts.regular }}
                                data={findCompany(selectedItem.name)}
                                defaultValue={name}
                                onChangeText={text => setSelectedItem(prevState => ({
                                    ...prevState,
                                    name: text
                                }))}
                                placeholder="Search a company"
                                maxLength={50}
                                flatListProps={{
                                    keyExtractor: (item) => item.id.toString(),
                                    renderItem: renderItem,
                                }}
                            // flatListProps={{
                            //     keyExtractor: item => item.id,
                            //     renderItem: ({ item }) => (
                            //         <ScrollView keyboardShouldPersistTaps='always'>
                            //             <TouchableOpacity onPress={() => handleSelectItem(item)} style={{ width: '100%', height: '100%' }}>
                            //                 <Text style={[styles.whiteLightText, compStyles.renderList]}>
                            //                     {item.name}
                            //                 </Text>
                            //             </TouchableOpacity>
                            //         </ScrollView>
                            //     ),
                            // }}
                            />
                        </View>
                        {selectedItem &&
                            <View style={{ marginVertical: 20, marginRight: 15 }}>
                                <TouchableOpacity onPress={handleAdd} >
                                    <Ionicons name="add-circle-outline" size={30} color="#00bac9" />
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    <View style={{ height: 80 }}></View>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
};

export default CurrentCompanyFiltersScreen;


const compStyles = StyleSheet.create({
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
    renderList: {
        fontFamily: fonts.regular,
        paddingVertical: 10,
        paddingLeft: 10,
        backgroundColor: '#00bac9',
        margin: 1
    }

});