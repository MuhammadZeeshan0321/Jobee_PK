import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fonts } from '../../utility/auth';
import { styles } from '../../../assets/css/styles';

export default class JobSearch extends Component {
    jobTitlePressEvent = () => {
        this.props.JobtitlePressEvent();
    };
    regionPressEvent = () => {
        this.props.AllRegionPressEvent();
    };
    findJobsButtonEvent = () => {
        this.props.FindJobsButtonEvent();
    }

    render() {
        const { objTitle, objRegion } = this.props.JobSearch;

        return (
            <View style={styles.mainPageContainer}>
                <Image source={require('../../../assets/img/fjbackground.jpg')} style={styles.backgroundImage} />
                <Text style={[styles.mainWhiteText, styles.centerText, { fontFamily: fonts.bold, paddingTop: '12%' }]}>Find Jobs</Text>
                <Text style={[styles.whiteHeadingText, styles.centerText, { fontFamily: fonts.regular }]}>Anytime, anywhere.</Text>
                <View style={[styles.row, styles.jobsearchContainer]} >
                    <View>
                        <TouchableWithoutFeedback
                            onPress={this.jobTitlePressEvent} >
                            <Ionicons name="search" size={30} color="#fff" />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.searchBarContainer}>
                        <TouchableWithoutFeedback
                            onPress={this.jobTitlePressEvent}>
                            <View>
                                <Text style={[styles.whiteLightText, { fontFamily: fonts.regular, paddingVertical: 6 }]}>{objTitle}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={[styles.row, styles.jobsearchContainer]}>
                    <View>
                        <TouchableWithoutFeedback
                            onPress={this.regionPressEvent} >
                            <Ionicons name="location-sharp" size={30} color="#fff" />
                            {/* <Icon name="ios-pin-outline" size={30} color='#fff' /> */}
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.searchBarContainer}>
                        <TouchableWithoutFeedback
                            onPress={this.regionPressEvent} >
                            <View>
                                <Text style={[styles.whiteLightText, { fontFamily: fonts.regular, paddingVertical: 6 }]}>{objRegion}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.regularbtnOuter}
                        onPress={this.findJobsButtonEvent}
                        underlayColor="#fff">
                        <Text style={[styles.whiteHeadingText, styles.centerText, { fontFamily: fonts.bold }]}>Find Jobs</Text>
                    </TouchableOpacity>
                </View>
                {
                    // (!this.props.IsLogin && this.props.Loading) ?
                    // <View style={styles.signupContainer}>
                    //     <ActivityIndicator animating size="small" />
                    // </View>
                    // :
                    // this.props.IsLogin ? null :
                    this.props.IsLogin ? null :
                        <View>
                            <View style={styles.centerAlign}>
                                <TouchableOpacity onPress={this.props.signupButtonEvent} style={styles.linkbtnOuter}>
                                    <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular, color: '#FCFAAB' }]}>
                                        Create an account
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.centerRow}>
                                <Text style={[styles.whiteLightText, { fontFamily: fonts.regular, paddingRight: 10 }]}>Already have an account?</Text>
                                <TouchableOpacity onPress={this.props.signinButtonEvent} style={styles.linkbtnOuter}>
                                    <Text style={[styles.lightText, styles.centerText, { fontFamily: fonts.regular, color: '#FCFAAB' }]}>
                                        Sign in
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }
            </View>
        );
    }


}