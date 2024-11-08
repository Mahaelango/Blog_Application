import axios from 'axios';
import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config.js';

const API_URL = 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        "content-type": "application/json"
    }
});

axiosInstance.interceptors.request.use(
    function(config) {
        // Add any custom configurations if needed
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function(response) {
        // Stop global loader here
        return processResponse(response);
    },
    function(error) {
        // Stop global loader here
        return Promise.reject(ProcessError(error));
    }
);

///////////////////////////////
// If success -> returns { isSuccess: true, data: object }
// If fail -> returns { isFailure: true, status: string, msg: string, code: int }
//////////////////////////////
const processResponse = (response) => {
    if (response?.status === 200) {
        return { isSuccess: true, data: response.data };
    } else {
        return {
            isFailure: true,
            status: response?.status,
            msg: response?.msg,
            code: response?.code
        };
    }
}

///////////////////////////////
// If success -> returns { isSuccess: true, data: object }
// If fail -> returns { isError: true, status: string, msg: string, code: int }
//////////////////////////////
const ProcessError = async (error) => {
    if (error.response) {
        console.log("ERROR IN RESPONSE: ", error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.responseFailure,
            code: error.response.status
        };
    }
    else if (error.request) { 
        // The request was made but no response was received
        console.log("ERROR IN REQUEST: ", error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure,
            code: ""
        };
    } else { 
        // Something happened in setting up the request that triggered an Error
        console.log("ERROR IN NETWORK: ", error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkError,
            code: ""
        };
    }
}

// Modified to handle file uploads
const API = {};

// Function to handle file uploads
API.uploadFile = (file, showUploadProgress) => {
    const data = new FormData();
    data.append('file', file); // Append file to form data

    return axiosInstance({
        method: 'POST',
        url: SERVICE_URLS.uploadFile.url, // Assuming you have the upload file endpoint
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: function(progressEvent) {
            if (showUploadProgress) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                showUploadProgress(percentCompleted);
            }
        }
    });
};

// Add other API routes as needed
for (const [key, value] of Object.entries(SERVICE_URLS)) {
    if (key !== 'uploadFile') { // Skip file upload route here
        API[key] = (body, showUploadProgress, showDownloadProgress) =>
            axiosInstance({
                method: value.method,
                url: value.url,
                data: body,
                responseType: value.responseType,
                onUploadProgress: function(progressEvent) {
                    if (showUploadProgress) {
                        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        showUploadProgress(percentCompleted);
                    }
                },
                onDownloadProgress: function(progressEvent) {
                    if (showDownloadProgress) {
                        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        showDownloadProgress(percentCompleted);
                    }
                }
            });
    }
}

export { API };
