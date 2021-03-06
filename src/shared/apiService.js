import axios from 'axios';

export const apiBase = '/api/v1';

export const apiStore = { store: null };

export const api = axios.create({
  baseURL: apiBase,
  timeout: 1000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const custconfig = config;
    // Merge custconfig dicts
    custconfig.headers = { ...config.headers, ...apiStore.store.getters['user/apiAuth'] };
    // Do something before request is sent
    // console.log(custconfig)
    return custconfig;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (err) => {
    // console.log(err.response.status);
    console.log(err);
    if (err.response && err.response.status === 401) {
      console.log('Dispatching refresh_token...');
      apiStore.store.dispatch('user/refresh_token');
      // maybe redirect to /login if needed !
    }
    return new Promise((resolve, reject) => {
      reject(err);
    });
    // // return Promise.reject(err);
  },
);

export function setBaseUrl(baseURL) {
  if (baseURL === null) {
    // Reset to "local" baseurl
    api.defaults.baseURL = apiBase;
  } else if (!baseURL.endsWith(apiBase)) {
    api.defaults.baseURL = `${baseURL}${apiBase}`;
  } else {
    api.defaults.baseURL = `${baseURL}`;
  }
  // Do some more testing here ?
}
