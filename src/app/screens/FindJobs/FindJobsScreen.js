import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, Platform, Alert, View, ActivityIndicator, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { styles } from '../../../assets/css/styles';
import Screen from '../../Constants/Screen';
import JobSearch from '../../components/FindJobs/JobSearch';
import FindJobsModels from '../../models/screenModels/FindJobsModels';


function FindJobsScreen({ navigation }) {

    const [findJobsModel] = useState(new FindJobsModels());
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         netStatus: true,
    //         refreshing: false,
    //         islogin: true,
    //         isLoading: false,
    //         apploading: false,
    //         JobSearch: {
    //             titleId: 0,
    //             objTitle: 'Job title, skills or company',
    //             regionId: 0,
    //             objRegion: 'All Regions',
    //             isRegularSearch: true,
    //             searchFrom: '',
    //             searchObject: [],
    //         },
    //         userRecommendedJobs: [],
    //         IndustryJobsList: [],
    //         jobListByCity: [],
    //         featuredJobsList: []
    //     }
    // }

    const navigatorStyle = { tabBarHidden: true };


    useEffect(() => {
        findJobsModel.updateAppLoading(true);
        toggleTabbar(' hidden ')
    }, []);

    function toggleTabbar(val) {
        // navigation.toggleTabs({
        //     to: val,
        //     animate: true,
        // });
        // this.props.navigator.toggleTabs({
        //     to: val,
        //     animate: true,
        // });
    }

    useEffect(() => {
        findJobsModel.googleAnalyticsView();
        // this.setState({ islogin: appLogin });
        // NetInfo.isConnected.addEventListner('connectionChange', this.handleConnectionChange);
        if (Platform.OS === 'ios') {
            // SplashScreen.hide();
        }
    }, []);



    const onRefreshControl = () => {
        // this.setState({ refreshing: true });
        // this.makeRemoteRequest();
    }

    const searchJobtitleEventHandler = () => {
        // this.searchCriteriaEventHandler(
        //   'Jobee.SearchCriteriaScreen',
        //   'Job title, skills or company',
        //   false,
        //   this.state.JobSearch.objTitle,
        //   this.updateObjectState
        // );
    };

    const searchAllRegionEventHandler = () => {
        // this.searchCriteriaEventHandler(
        //     'Jobee.SearchCriteriaScreen',
        //     'All Region',
        //     true,
        //     this.state.JobSearch.objRegion,
        //     this.updateObjectState
        // );
    };

    const SignupEventHandler = async () => {
         navigation.navigate('Signup'); 
        // this.showChildModalEventHandler('Jobee.SignupScreen', 'Sign up', 'findjobs', this.updateObject);
    };

    const SigninEventHandler = () => {
        navigation.navigate('Signin');
        // this.showChildModalEventHandler('Jobee.SigninScreen', 'Sign in', 'findjobs', this.updateObject);
    };

    const findJobsEventHandler = () => {
        // let _jobSearch = Object.assign({}, this.state.JobSearch);
        // if (!_jobSearch.isRegularSearch) {
        //   _jobSearch.isRegularSearch = true;
        //   _jobSearch.searchFrom = '';
        //   _jobSearch.searchObject = [];
        //   this.setState({ JobSearch: _jobSearch });
        // }
        // this.searchCriteriaEventHandler('Jobee.JobSearchResultScreen', 'Jobs Results Found', false, _jobSearch, null);
    };

    function setJobSearch() {
        return findJobsModel.state.JobSearch;
    }

    return (
        <ScrollView style={styles.container}
        // refreshControl={
        //     <RefreshControl
        //         refreshing={this.state.refreshing}
        //         onRefresh={onRefreshControl}
        //     />
        // }
        >
            <JobSearch
                JobSearch={findJobsModel.state.JobSearch}
                JobtitlePressEvent={searchJobtitleEventHandler}
                AllRegionPressEvent={searchAllRegionEventHandler}
                signupButtonEvent={SignupEventHandler}
                signinButtonEvent={SigninEventHandler}
                FindJobsButtonEvent={findJobsEventHandler}
            // IsLogin={findJobsModel.state.islogin}
            // Loading={findJobsModel.state.isLoading}
            />
        </ScrollView>
    );
}


export default FindJobsScreen;
