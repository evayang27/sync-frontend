import _ from 'lodash'
import { apiBase, pathJoin } from '.'

class ArticleAPI {
  constructor() {
    // apiBase.action('/article', {}, 'get')
    this.prefix_path = '/article'
  }

  getPath(path) {
    return pathJoin([this.prefix_path, path])
  }

  /**
   * fetch articles
   * @returns {Promise<any>}
   */
  get() {
    return apiBase.action(this.getPath('/'), {}, 'get')
  }

  // TODO: temporary solution
  /**
   * get recommendations
   * @param {Number} limit : limit number of articles
   * @returns {Promise<Any>}
   */
  getRecommended(limit) {
    return apiBase.action(this.getPath('/'), { limit }, 'get')
  }

  /**
   * fetch article by id
   * @param {string} id : article id
   * @returns {Promise<any>}
   */
  getById(id) {
    return apiBase.action(this.getPath(`/${id}`), {}, 'get')
  }

  /**
   * create new article
   * @param {Any} data : article data
   * @returns {Promise<any>}
   */
  create(data) {
    return apiBase.action(this.getPath('/'), data, 'post')
  }

  /**
   * update article by id
   *
   * ! **IMPORTANT**: id should be passed in data
   * @param {Any} data : article data
   * @returns {Promise<any>}
   * @memberof ArticleAPI
   */
  update(data) {
    return apiBase.action(this.getPath('/'), data, 'put')
  }

  search(keyword = '', timeQuery = 'qdr:a', category = '', tag = '') {
    this.prefix_path = '/'
    const query = {
      q: keyword ?? '',
      tbs: timeQuery ?? 'qdr:a',
      category: category ?? '',
      tag: tag ?? ''
    }

    const ret = apiBase.action(this.getPath('/search'), {
      ...query
    }, 'get')
    this.prefix_path = '/article'

    return ret
  }
}

export function getTimeQuery(timeRange = 'all') {
  return _.get(TIME_QUERY, timeRange.toUpperCase(), TIME_QUERY.ALL)
}

export const TIME_QUERY = Object.freeze({
  ALL: 'qdr:a',
  YEAR: 'qdr:y',
  MONTH: 'qdr:m',
  WEEK: 'qdr:w',
  DAY: 'qdr:d'
})

export const articleAPI = new ArticleAPI()

// export default new ArticleAPI()
