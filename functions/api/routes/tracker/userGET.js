const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const fetchGET = require('../../../lib/fetchGET');
const githubHost = require('../../../lib/githubHost');

module.exports = async (req, res) => {
  const { userId } = req.params;
  const githubUrl = githubHost(userId);
  console.log(fetchGET(githubUrl));
};
