import {Platform} from "react-native";

const url = __DEV__ ? (Platform.OS === 'ios' ? 'http://10.0.2.32:3050' : 'http://10.0.2.2:3050') : 'https://api.tyf-app.com';

const apiConfig = {
    // static: Platform.OS === 'ios' ? 'http://127.0.0.1:3050/static/' : 'http://10.0.2.2:3050/static/',
    // url: Platform.OS === 'ios' ? 'http://127.0.0.1:3050/api/' : 'http://10.0.2.2:3050/api/'
    static:`${url}/static/`,
    url: `${url}/api/`
};

export default apiConfig;

