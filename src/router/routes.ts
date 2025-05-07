export const routes = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    redirect: '/login',
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
          title: '系统首页',
          show: true,
        },
      },
      {
        path: '/course',
        component: () => import('@/views/course/index.vue'),
        name: 'course',
        meta: {
          title: '课程课表',
          show: true,
        },
      },
      {
        path: '/study',
        name: 'plan',
        meta: {
          title: '学程规划',
          show: true,
        },
        children: [
          {
            path: '/study/plan',
            component: () => import('@/views/study_plan/index.vue'),
            name: 'course-homework',
            meta: {
              title: '学习计划',
              show: true,
            },
          },
          {
            path: '/study/process',
            component: () => import('@/views/study_process/index.vue'),
            name: 'study-progress',
            meta: {
              title: '学习过程',
              show: true,
            },
          },
        ],
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
        path: '/calendar',
        component: () => import('@/views/calendar/index.vue'),
        name: 'calendar',
        meta: {
          title: '日程日历',
          show: true,
        },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/views/auth/index.vue'),
    name: 'auth',
    meta: {
      title: '登录认证',
      show: false,
    },
    children: [
      {
        path: '/login',
        component: () => import('@/views/auth/components/LoginForm.vue'),
        name: 'login',
        meta: {
          title: '登录',
          show: false,
        },
      },
      {
        path: '/register',
        component: () => import('@/views/auth/components/RegisterForm.vue'),
        name: 'register',
        meta: {
          title: '注册',
          show: false,
        },
      },
      {
        path: '/forgot-password',
        component: () => import('@/views/auth/components/ForgotPassword.vue'),
        name: 'forgot-password',
        meta: {
          title: '忘记密码',
          show: false,
        },
      },
    ],
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
