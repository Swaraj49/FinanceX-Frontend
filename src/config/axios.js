import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Set default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;