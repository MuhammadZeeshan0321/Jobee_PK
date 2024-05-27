import React from 'react';
import { ScrollView, RefreshControl, Platform, Alert, View, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import NetInfo from '@react-native-community/netinfo';

import { styles } from '../../../assets/css/styles';
import Screen from '../../Constants/Screen';
import JobSearch from '../../components/FindJobs/JobSearch';

class FindJobsScreen extends Screen {
    constructor(props) {
        super(props);
        this.state = {
            netStatus: true,
            refreshing: false,
            islogin: true,
            isLoading: false,
            apploading: false,
            JobSearch: {
                titleId: 0,
                objTitle: 'Job title, skills or company',
                regionId: 0,
                objRegion: 'All Regions',
                isRegularSearch: true,
                searchFrom: '',
                searchObject: [],
            },
            userRecommendedJobs: [],
            IndustryJobsList: [],
            jobListByCity: [],
            featuredJobsList: []
        }
    }

    static navigatorStyle = {
        tabBarHidden: true,
    };

    componentWillMount() {
        this.setState({ apploading: true });
      //  this.toggleTabbar(' hidden ')
    }

    toggleTabbar = (val) => {
        this.props.navigator.toggleTabs({
            to: val,
            animate: true,
        });
    };

    componentDidMount() {
        super.googleAnalyticsView('/Find Jobs');
        // this.setState({ islogin: appLogin });
        // NetInfo.isConnected.addEventListner('connectionChange', this.handleConnectionChange);
        if (Platform.OS === 'ios') {
            // SplashScreen.hide();
        }
    }

    onRefreshControl = () => {
        this.setState({ refreshing: true });
        this.makeRemoteRequest();
    }

    searchJobtitleEventHandler = () => {
        // this.searchCriteriaEventHandler(
        //   'Jobee.SearchCriteriaScreen',
        //   'Job title, skills or company',
        //   false,
        //   this.state.JobSearch.objTitle,
        //   this.updateObjectState
        // );
    };

    searchAllRegionEventHandler = () => {
        // this.searchCriteriaEventHandler(
        //     'Jobee.SearchCriteriaScreen',
        //     'All Region',
        //     true,
        //     this.state.JobSearch.objRegion,
        //     this.updateObjectState
        // );
    };

    SignupEventHandler = () => {
        
        // this.showChildModalEventHandler('Jobee.SignupScreen', 'Sign up', 'findjobs', this.updateObject);
    };

    SigninEventHandler = () => {
        // this.showChildModalEventHandler('Jobee.SigninScreen', 'Sign in', 'findjobs', this.updateObject);
    };

    findJobsEventHandler = () => {
        // let _jobSearch = Object.assign({}, this.state.JobSearch);
        // if (!_jobSearch.isRegularSearch) {
        //   _jobSearch.isRegularSearch = true;
        //   _jobSearch.searchFrom = '';
        //   _jobSearch.searchObject = [];
        //   this.setState({ JobSearch: _jobSearch });
        // }
        // this.searchCriteriaEventHandler('Jobee.JobSearchResultScreen', 'Jobs Results Found', false, _jobSearch, null);
    };

    render() {
        // const navigation = useNavigation();

        return (
            <ScrollView style={styles.container}>
                <JobSearch
                    JobSearch={this.state.JobSearch}
                    JobtitlePressEvent={this.searchJobtitleEventHandler}
                    AllRegionPressEvent={this.searchAllRegionEventHandler}
                    signupButtonEvent={this.SignupEventHandler}
                    signinButtonEvent={this.SigninEventHandler}
                    FindJobsButtonEvent={this.findJobsEventHandler}
                // IsLogin={this.state.islogin}
                // Loading={this.state.isLoading}
                />

            </ScrollView>
        );
    }

}

export default FindJobsScreen;