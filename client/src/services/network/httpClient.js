import axios from 'axios';

const request = async (options = {}) => {
  const response = await axios({
    method: options.method,
    url: options.url,
    headers: options.headers,
    data: options.body,
    params: options.params,
  });
  return response;
};

export default request;
