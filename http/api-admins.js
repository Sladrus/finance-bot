const { baseApi } = require('./api');

async function getAdmins(bot) {
  try {
    const response = await baseApi.get(`/admins`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getAdmins };
