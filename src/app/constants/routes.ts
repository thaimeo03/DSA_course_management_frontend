export const ROUTES = {
  home: '',
  login: '/auth/login',
  register: '/auth/register',
  purchasedCourse: '/purchased-course',
  account: '/user/account',
  order: '/user/order',
  detailCourse: '/course',
  lecture: 'lecture',
  problemRepository: 'problem-repository',
  problem: 'problem',
  admin: '/admin',
  adminCourse: '/admin/course',
  adminCreateCourse: '/admin/course/create',
  adminCourseEdit: '/admin/course/:id/edit',
  adminLecture: '/admin/lecture',
  adminCreateLecture: '/admin/lecture/create',
  adminLectureEdit: '/admin/lecture/:id/edit',
  adminProblem: '/admin/problem',
  adminCreateProblem: '/admin/problem/create',
  adminProblemEdit: '/admin/problem/:id/edit',
  adminCoupon: '/admin/coupon',
  adminCreateCoupon: '/admin/coupon/create',
  adminCouponEdit: '/admin/coupon/:id/edit',
} as const;
