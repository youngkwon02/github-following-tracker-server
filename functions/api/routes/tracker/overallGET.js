const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const { fetchGET } = require('../../../lib/fetchGET');
const { githubHost } = require('../../../lib/githubHost');
const { getRequestUrl } = require('../../../lib/getRequestUrl');
const { pageType } = require('../../../constants/pageType');
const { stringToHtml } = require('../../../lib/stringToHtml');

const getFollowing = async (gitHost) => {
  let followings = [];

  for (let page = 1; ; page++) {
    const requestUrl = getRequestUrl(gitHost, '', {
      page,
      tab: pageType.FOLLOWING,
    });

    let res = await fetchGET(requestUrl);
    const jsDomRes = stringToHtml(res.data);

    const tagElements = jsDomRes.window.document.querySelectorAll('.d-table-cell .Link--secondary');

    if (!tagElements.length) {
      break;
    }
    tagElements.forEach((n) => followings.push(n.textContent));
  }

  return followings;
};

const getFollowers = async (gitHost) => {
  let followers = [];

  for (let page = 1; ; page++) {
    const requestUrl = getRequestUrl(gitHost, '', {
      page,
      tab: pageType.FOLLOWERS,
    });

    let res = await fetchGET(requestUrl);
    const jsDomRes = stringToHtml(res.data);

    const tagElements = jsDomRes.window.document.querySelectorAll('.d-table-cell .Link--secondary');

    if (!tagElements.length) {
      break;
    }
    tagElements.forEach((n) => followers.push(n.textContent));
  }
  return followers;
};

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

  const followings = await getFollowing(githubUrl);
  const followers = await getFollowers(githubUrl);

  const only = {
    followingOnly: [],
    followerOnly: [],
  };

  followings.forEach((f) => {
    !followers.includes(f) ? only.followingOnly.push(f) : false;
  });

  followers.forEach((f) => {
    !followings.includes(f) ? only.followerOnly.push(f) : false;
  });

  const data = {
    numOfFollowing: followings.length,
    numOfFollowers: followers.length,
    numOfOnlyFollowing: only.followingOnly.length,
    numOfOnlyFollowers: only.followerOnly.length,
    ...only,
  };

  return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.TRACKING_SUCCESS, data));
};
