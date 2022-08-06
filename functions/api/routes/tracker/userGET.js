const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const { fetchGET } = require('../../../lib/fetchGET');
const { githubHost } = require('../../../lib/githubHost');
const { stringToHtml } = require('../../../lib/stringToHtml');

module.exports = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  }

  const githubUrl = githubHost(userId);
  let fetchRes = await fetchGET(githubUrl);
  if (!fetchRes) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_EXIST_USER));
  }

  return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.EXIST_USER));
};
