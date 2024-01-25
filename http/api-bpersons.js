const { baseApi } = require('./api');

async function checkReqs(body) {
  try {
    const response = await baseApi.post(`/bperson/check`, body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { checkReqs };
