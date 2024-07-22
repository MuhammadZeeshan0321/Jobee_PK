import { useState, useEffect, useContext } from "react";
import { View, RefreshControl, ActivityIndicator, ScrollView } from "react-native";
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from "@react-navigation/native";


import NetworkErrorScreen from "../DefaultScreen/NetworkError";
import DefaultScreen from "../DefaultScreen/DefaultScreen";
import ApplicationImage from '../../../assets/img/appImage.png';
import AppliedJobStatus from "../../components/Applications/JobStatus/AppliedJobStatus";
import { styles } from "../../../assets/css/styles";
import { AppContext } from "../../store/app-context";

function ApplicationsScreen() {
    const navigation = useNavigation();

    const [appData, setAppData] = useState({
        netStatus: true,
        refreshing: false,
        isLoading: false,
        islogin: false,
        JobsList: [],
        isloaded: false,
        apploading: false,
    });
    const appCtx = useContext(AppContext);

    const handleConnectionChange = (state) => {
        const isConnected = state.isConnected;
        setAppData((prevState) => ({
            ...prevState,
            netStatus: isConnected
        }));
        console.log("isConnected-----", isConnected);
        if (isConnected) {
            if (appCtx.appLogin) {
                setAppData((prevState) => ({
                    ...prevState,
                    islogin: true
                }));
                makeRemoteRequest();
            }
        }
    }

    useEffect(() => {
        console.log("useEffect--")
        setAppData((prevState) => ({
            ...prevState,
            islogin: appCtx.appLogin
        }));
        const unsubscribe = NetInfo.addEventListener(handleConnectionChange);

        // Cleanup function to remove the event listener, similar to componentWillUnmount
        return () => {
            unsubscribe();
        };

    }, []);


    const reloadThePage = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                handleConnectionChange(state);
            }
        });
    };

    const signOutView = () => {
        onRefreshControl();
    };

    const onRefreshControl = () => {
        setAppData((prevState) => ({
            ...prevState,
            isdisable: false, refreshing: true
        }));
        if (appCtx.appLogin) {
            setAppData((prevState) => ({
                ...prevState, islogin: true
            }));
            makeRemoteRequest();
        } else {
            if (isappTabViewed) {
                setAppTabViewed(false);
            }
            setAppData((prevState) => ({
                ...prevState,
                isdisable: false, islogin: false, refreshing: false, isLoading: false
            }));
        }
    };

    const SignupHandler = () => {
        // this.setState({ isdisable: true });
        navigation.navigate('Signup',
            {
                props: {
                    calledFrom: 'applications'
                }
            }
        );
    };

    const updateObject = (objVal) => {
        if (objVal) {
            // setAppData((prevState) => ({
            //     ...prevState,
            //     islogin: true, isdisable: false
            // }));
            makeRemoteRequest();
        } else {
            // setAppData((prevState) => ({
            //     ...prevState,
            //     islogin: objVal, isdisable: false
            // }));
        }
    };

    const SigninEventHandler = () => {
        // this.setState({ isdisable: true });
        const data = updateObject;
        navigation.navigate('Signin', {
            props: {
                calledFrom: 'applications',
                UpdateObjectState: data
            }
        });
    };

    const makeRemoteRequest = () => {
        console.log("makeRemote Request is called-----------")
        // this.setState({ isLoading: true });
        // makeAjaxRequest(`${apiUrl}/candidate/candidatedashboard`, userInfo.access_token, userInfo.userId).then((res) => {
        //     debugger;
        //     //console.log(res);
        //     const jobList = [];
        //     let resData = JSON.parse(res);
        //     if (resData.candidateJobs !== null && resData.candidateJobs.length > 0) {
        //         resData.candidateJobs.map((obj) => {
        //             const cityList = [];
        //             const statusList = [];
        //             obj.candidateJobLocation.map((jl) => {
        //                 cityList.push({
        //                     city: jl.cityText
        //                 });
        //             });
        //             // obj.candidateJobStatus.map((js) => {
        //             //   statusList.push({
        //             //     status: parseInt(js.statusID),
        //             //     statusDate: moment(new Date(obj.appliedDate)).format('MM-DD-YYYY')
        //             //   });
        //             // });
        //             //console.log(obj.candidateJobStatus.statusDate);
        //             jobList.push({
        //                 jobId: obj.jobID,
        //                 jobTitle: obj.title,
        //                 companyName: obj.companyName,
        //                 city: cityList,
        //                 country: obj.candidateJobLocation.length === 0 ? '' : obj.candidateJobLocation[0].country,
        //                 status: obj.candidateJobStatus[0] === undefined ? 5 : parseInt(obj.candidateJobStatus[0].statusID),
        //                 statusDate: obj.candidateJobStatus[0] === undefined ? '' : moment(new Date(), 'MM-DD-YYYY').diff(moment(obj.candidateJobStatus[0].statusDate, 'MM-DD-YYYY').toDate(), 'days')
        //             });
        //         });
        //     }
        //     // if(this.state.apploading){
        //     //   this.toggleTabbar('show');
        //     // }
        //     setAppTabViewed(true);
        //     this.setState({
        //         JobsList: jobList,
        //         refreshing: false,
        //         isLoading: false,
        //         isloaded: true,
        //         //apploading: false
        //     });
        // }).catch((error) => {
        //     this.setState({ isLoading: false, refreshing: false });
        //     console.log(error.message);
        // });
    }

    const applicantJobDetailEventHandler = (jobId, status) => {
        // setAppData((prevState) => ({
        //     ...prevState,
        //     isdisable: true
        // }));
        let dataObj = {};
        switch (status) {
            case 5:
                dataObj = { applicantStatus: 'Applied' };
                break;
            case 7:
                dataObj = { applicantStatus: 'Viewed' };
                break;
            case 6:
                dataObj = { applicantStatus: 'Shortlisted' };
                break;
            case 8:
                dataObj = { applicantStatus: 'Interviewed' };
                break;
            case 10:
                dataObj = { applicantStatus: 'Selected' }
                break;
            case 18:
                dataObj = { applicantStatus: 'JobeeMatched' }
                break;
            // case 9:
            //   dataObj = { applicantStatus: 'Rejected'};           
            //   break;
            default:
                //dataObj = { applicantStatus: 'Selected'};           
                break;
        }
        navigation.navigate('JobDetail', {
            props: {
                ObjectVal: dataObj,
                UpdateObjectState: jobId
            }
        });
    }



    return (
        appData.netStatus ?
            appData.isLoading ?
                <View style={{ paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#CDE0CE', backgroundColor: '#fff', height: '100%', justifyContent: 'center' }}>
                    <ActivityIndicator animating size="large" />
                </View>
                :
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={appData.refreshing}
                            onRefresh={onRefreshControl}
                        />
                    }
                    style={[styles.container1, { paddingVertical: 20 }]}
                >
                    {
                        appData.islogin === false ?
                            <DefaultScreen
                                imagePath={ApplicationImage}
                                menuText="Apply on jobee.pk and keep a track of your applications. We keep you informed about your application status until you are selected!"
                                profileInstraction="Create your profile now to increase your chances of finding the best jobs for free on jobee.pk"
                                buttonEvent={SignupHandler}
                                signinButtonEvent={SigninEventHandler}
                            />
                            :
                            <AppliedJobStatus
                                // isDisable={appData.isdisable}
                                imagePath={ApplicationImage}
                                JobsList={appData.JobsList}
                                onJobClickEvent={applicantJobDetailEventHandler}
                            />
                    }
                </ScrollView>
            :
            <NetworkErrorScreen Retry={reloadThePage} />
    );
}

export default ApplicationsScreen;
