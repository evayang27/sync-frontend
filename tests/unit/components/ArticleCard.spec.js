import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, getByText } from '@testing-library/vue'
import ArticleCard from '@/components/ArticleCard.vue'
import store from '@/store'
import router from '@/router'
// import Vuex from 'vuex'

vi.mock('@/utils/firebase')
vi.mock('@/router', () => ({
  resolve: vi.fn()
}))

let props

beforeEach(() => {
  // set default props
  props = {
    title: 'title',
    viewsCount: 0,
    category: '未分類',
    lastUpdatedAt: '2021-04-26T00:00:00',
    editedCount: 0,
    blocks: null,
    articleId: '',
    full: false
  }
})

/**
 * @vitest-environment jsdom
 */
describe('ArticleCard.vue', () => {
  it('default value', () => {
    const Vuex = require('vuex')
    console.log(store instanceof Vuex.Store)
    const { container } = render(ArticleCard, { props, store, router })

    const heading = container.querySelector('.heading')
    const footer = container.querySelector('.card-footer')
    const category = container.querySelector('.article-category')
    const fullCardText = container.querySelector('.article-excerpt--wide')

    expect(getByText(heading, 'title')).toBeInTheDocument()
    expect(getByText(footer, '觀看數：0 | 編輯數：0'))
    expect(getByText(footer, '2021.04.26 00:00'))
    expect(getByText(category, '未分類'))
    expect(fullCardText).not.toBeInTheDocument()

    // TODO: add test on content
  })

  it('full card view', () => {
    props.full = true
    const { container } = render(ArticleCard, { props, store, router })
    const fullCardText = container.querySelector('.article-excerpt--wide')

    expect(fullCardText).toBeInTheDocument()
  })
})
