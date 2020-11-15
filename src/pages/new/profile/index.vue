<template>
  <b-container fluid>
    <b-row>
      <b-col cols="3">
        <b-row class="mb-5">
          <UserInfo />
        </b-row>
        <b-row
          class="mt-5"
        >
          <ButtonStack @updateActiveIndex="updateActiveIndex" />
        </b-row>
      </b-col>
      <b-col
        v-if="activeIndex === 0"
        cols="9"
      >
        <b-container class="ml-4">
          <b-row
            v-for="(article, index) in editedArticles"
            :key="index"
          >
            <ArticleCell
              :title="article.title"
              :last-modified-time="article.lastModifiedTime"
              :editors-count="article.editorsCount"
              :tags="article.tags"
              :class="{dark: index%2}"
            />
          </b-row>
        </b-container>
      </b-col>
      <b-col
        v-else-if="activeIndex === 1"
        cols="9"
      >
        <b-container class="ml-4">
          <b-row class="mt-5 group-title">
            最近一週
          </b-row>
          <b-row
            v-for="(article, index) in recentWeekArticles"
            :key="index"
          >
            <ArticleCell
              :title="article.title"
              :last-modified-time="article.lastModifiedTime"
              :editors-count="article.editorsCount"
              :tags="article.tags"
              :class="{dark: index%2}"
            />
          </b-row>
          <b-row class="mt-5 group-title">
            最近一個月
          </b-row>
          <b-row
            v-for="(article, index) in recentMonthArticles"
            :key="index+recentWeekArticles.length"
          >
            <ArticleCell
              :title="article.title"
              :last-modified-time="article.lastModifiedTime"
              :editors-count="article.editorsCount"
              :tags="article.tags"
              :class="{dark: index%2}"
            />
          </b-row>
        </b-container>
      </b-col>
      <b-col
        v-else-if="activeIndex === 2"
        cols="9"
      >
        <b-container class="ml-4">
          <b-row class="mt-5 group-title">
            {{ myTopics[0].title }}
          </b-row>
          <b-row
            v-for="(article, index) in myTopics[0].articles"
            :key="index"
          >
            <ArticleCell
              :title="article.title"
              :last-modified-time="article.lastModifiedTime"
              :editors-count="article.editorsCount"
              :tags="article.tags"
              :class="{dark: index%2}"
            />
          </b-row>
          <b-row class="mt-5 group-title">
            {{ myTopics[1].title }}
          </b-row>
          <b-row
            v-for="(article, index) in myTopics[1].articles"
            :key="index+myTopics[0].articles.length"
          >
            <ArticleCell
              :title="article.title"
              :last-modified-time="article.lastModifiedTime"
              :editors-count="article.editorsCount"
              :tags="article.tags"
              :class="{dark: index%2}"
            />
          </b-row>
        </b-container>
      </b-col>
      <b-col
        v-else-if="activeIndex === 3"
        cols="9"
      >
        <b-container class="ml-4">
          <b-row class="mt-5 group-title">
            推薦
          </b-row>
          <b-row
            v-for="(article, index) in recentWeekArticles"
            :key="index"
          >
            <ArticleCell
              :title="article.title"
              :last-modified-time="article.lastModifiedTime"
              :editors-count="article.editorsCount"
              :tags="article.tags"
              :class="{dark: index%2}"
            />
          </b-row>
          <b-row class="mt-5 group-title">
            昨日
          </b-row>
          <b-row
            v-for="(article, index) in recentMonthArticles"
            :key="index+recentWeekArticles.length"
          >
            <ArticleCell
              :title="article.title"
              :last-modified-time="article.lastModifiedTime"
              :editors-count="article.editorsCount"
              :tags="article.tags"
              :class="{dark: index%2}"
            />
          </b-row>
        </b-container>
      </b-col>
    </b-row>
    <Footer />
  </b-container>
</template>

<script>
import ArticleCell from '@/components/new/Profile/ArticleCell'
import UserInfo from '@/components/new/Profile/UserInfo'
import ButtonStack from '@/components/new/Profile/ButtonStack'
import Footer from '@/components/new/Footer'
export default {
  name: 'Profile',
  components: { ArticleCell, UserInfo, ButtonStack, Footer },
  data () {
    return {
      myTopics: [{
        title: '#政治',
        articles: [{
          title: '政治1',
          lastModifiedTime: '10/14  17:35',
          editorsCount: 11,
          tags: []
        }, {
          title: '政治2',
          lastModifiedTime: '10/14  17:23',
          editorsCount: 33,
          tags: []
        }]
      }, {
        title: '#社會',
        articles: [{
          title: '社會1',
          lastModifiedTime: '10/14  17:35',
          editorsCount: 11,
          tags: []
        }, {
          title: '社會2',
          lastModifiedTime: '10/14  17:23',
          editorsCount: 33,
          tags: []
        }]
      }],
      editedArticles: [{
        title: '川普染疫',
        lastModifiedTime: '10/14  17:35',
        editorsCount: 11,
        tags: ['美國大選', '川普', '新冠肺炎']
      }, {
        title: '拜登發表談話',
        lastModifiedTime: '10/14  17:23',
        editorsCount: 33,
        tags: ['美國大選', '川普', '拜登']
      }, {
        title: '川普指控選舉舞弊',
        lastModifiedTime: '11/7  14:20',
        editorsCount: 1,
        tags: ['美國大選', '川普', '拜登', '密西根']
      }, {
        title: 'empty',
        lastModifiedTime: '??/??  17:35',
        editorsCount: 0,
        tags: []
      }],
      recentWeekArticles: [{
        title: '最近一週',
        lastModifiedTime: '10/14  17:35',
        editorsCount: 11,
        tags: ['美國大選', '川普', '新冠肺炎']
      }, {
        title: '最近一週2',
        lastModifiedTime: '10/14  17:23',
        editorsCount: 33,
        tags: ['美國大選', '川普', '拜登']
      }
      ],
      recentMonthArticles: [{
        title: '最近一個月',
        lastModifiedTime: '10/14  17:35',
        editorsCount: 11,
        tags: ['美國大選', '川普', '新冠肺炎']
      }, {
        title: '最近一個月2',
        lastModifiedTime: '10/14  17:23',
        editorsCount: 33,
        tags: ['美國大選', '川普', '拜登']
      }],
      activeIndex: 0
    }
  },
  methods: {
    updateActiveIndex (index) {
      this.activeIndex = index
    }
  }
}
</script>

<style scoped lang="scss">
.group-title {
  font-family: 'Noto Sans Mono CJK TC';
  font-size: 36px;
  font-weight: bold;
}
</style>
