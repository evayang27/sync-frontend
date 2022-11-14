import { apiBase, pathJoin } from '.'

class NewsAPI {
  constructor() {
    this.prefix_path = '/news'
  }

  getPath(path) {
    return pathJoin([this.prefix_path, path])
  }

  /**
   * search news in db
   * @param {String} keyword : keyword to search
   * @param {Number} pageNum : page number
   * @param {String} tbs : time range
   * @param {String} mediaSource : media source
   * @returns {Promise<Any>}
   */
  search(keyword = '', pageNum = 0, tbs = 'qdr:a', mediaSource = '') {
    return apiBase.action(
      this.getPath('/'),
      {
        q: keyword,
        page: pageNum,
        tbs: tbs,
        media: mediaSource
      },
      'get'
    )
  }
}

export const newsAPI = new NewsAPI()

// export default new NewsAPI()
