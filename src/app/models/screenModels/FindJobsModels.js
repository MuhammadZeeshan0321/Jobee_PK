import Screen from "../../Constants/Screen";

class FindJobsModels extends Screen {
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

    updateAppLoading(loading) {
        this.state.apploading = loading;
    }

    googleAnalyticsView(){
        super.googleAnalyticsView('/Find Jobs');
    }

}

export default FindJobsModels;