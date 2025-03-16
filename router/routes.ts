export const routes = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    redirect: '/home',
    meta: {
      title: 'layout',
      show: true,
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: {
          title: '首页',
          show: true,
        },
      },
      {
        path: '/calendar',
        component: () => import('@/views/schedule_calendar/index.vue'),
        name: 'calendar',
        meta: {
          title: '日程日历',
          show: true,
        },
      },
      {
        path: '/course',
        component: () => import('@/views/course_manager/index.vue'),
        name: 'course',
        meta: {
          title: '课表管理',
          show: true,
        },
      },
      {
        path: '/homework',
        component: () => import('@/views/homework_manager/index.vue'),
        name: 'homework',
        meta: {
          title: '作业管理',
          show: true,
        },
      },
      {
        path: '/todo',
        component: () => import('@/views/todo/index.vue'),
        name: 'todo',
        meta: {
          title: '待办事项',
          show: true,
        },
      },
      {
        path: '/friends',
        component: () => import('@/views/friends/index.vue'),
        name: 'friends',
        meta: {
          title: '我的好友',
          show: true,
        },
      },
      {
        path: '/shared-calendar',
        component: () => import('@/views/shared_calendar/index.vue'),
        name: 'shared-calendar',
        meta: {
          title: '共享日历',
          show: true,
        },
      },
      {
        path: '/ai-assistant',
        component: () => import('@/views/ai_assistant/index.vue'),
        name: 'ai-assistant',
        meta: {
          title: 'AI助手',
          show: true,
        },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录', // 路由标题
      show: false,
    },
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      show: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
      title: '任意路由',
      show: false,
    },
  },
]
