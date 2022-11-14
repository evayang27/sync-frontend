import { apiBase } from '.'

class UserAPI {
  constructor() {
    // apiBase.action('/article', {}, 'get')
    this.prefix_path = ''
  }

  login(userdata) {
    return apiBase.action('/login', userdata, 'post')
  }

  /**
   * get user's profile from firebase
   * @returns {Promise<Any>}
   */
  getProfile() {
    return apiBase.action('/profile', {}, 'post')
  }

  /**
   * get:
   *  - viewed articles
   *  - subscribed articles
   *  - edited articles
   *  - user's point
   * @returns {Promise<Any>}
   */
  getArticleInfo() {
    return apiBase.action('/profile/article', {}, 'post')
  }

  /**
   * add article to user's viewed history
   * @param {String} articleId : article id
   * @returns {Promise<Any>}
   */
  articleViewed(articleId) {
    return apiBase.action('/profile/view', { articleId }, 'post')
  }

  /**
   * subscribe or unsubscribe article
   * @param {String} articleId
   * @param {Boolean} subscribe : subscribe or unsubscribe
   * @returns {Promise<Any>}
   */
  subscribeArticle(articleId, subscribe) {
    return apiBase.action('profile/subscribe', { articleId, subscribe }, 'post')
  }
}

export const userAPI = new UserAPI()

// export default new UserAPI()
