# API Documentation

本文档记录了 tongclass.ac.cn 项目所有的 API 接口。

---

## 技术架构

- **后端**: Convex (BaaS)
- **API风格**: TypeScript Functions
- **调用方式**: `useQuery` / `useMutation` from `@convex-dev/react`

---

## 用户 API

### 查询接口

#### `users:getById`
根据用户ID获取用户信息

```typescript
const user = useQuery(api.users.getById, { id: "user_xxx" })
```

**参数**: `id`: 用户ID

---

#### `users:list`
获取用户列表

```typescript
const users = useQuery(api.users.list, { 
  skip: 0, 
  limit: 20,
  organization: "pku",
  cohort: 2024
})
```

---

#### `users:search`
搜索用户

```typescript
const users = useQuery(api.users.search, { query: "张三" })
```

---

### 变更接口

#### `users:create`
创建新用户

```typescript
const userId = useMutation(api.users.create)({
  email: "xxx@stu.pku.edu.cn",
  username: "zhangsan",
  englishName: "John Zhang",
  organization: "pku",
  cohort: 2024,
  studentId: "2100012345",
})
```

---

#### `users:update`
更新用户信息

```typescript
useMutation(api.users.update)({
  id: "user_xxx",
  englishName: "New Name",
})
```

---

## 成果 API

### 查询接口

#### `publications:list`
获取成果列表

```typescript
const publications = useQuery(api.publications.list, {
  category: "ML",
  year: 2024,
})
```

---

#### `publications:listByUser`
获取用户的成果列表

```typescript
const publications = useQuery(api.publications.listByUser, {
  userId: "user_xxx",
})
```

---

## 新闻 API

### 查询接口

#### `news:list`
获取新闻列表

```typescript
const news = useQuery(api.news.list, {
  category: "学术",
})
```

---

## 活动 API

### 查询接口

#### `events:list`
获取活动列表

```typescript
const events = useQuery(api.events.list, {
  fromDate: "2024-01-01",
  toDate: "2024-12-31",
})
```

---

## 课程评测 API

### 查询接口

#### `courseReviews:listByCourse`
获取课程评测列表

```typescript
const reviews = useQuery(api.courseReviews.listByCourse, {
  courseName: "人工智能导论",
})
```

---

#### `courseReviews:listCourses`
获取所有课程列表

```typescript
const courses = useQuery(api.courseReviews.listCourses)
```

---

### 变更接口

#### `courseReviews:create`
提交课程评测

```typescript
const reviewId = useMutation(api.courseReviews.create)({
  courseName: "人工智能导论",
  semester: "2024 Spring",
  rating: 9,
  content: "Great course!",
  isAnonymous: true,
})
```

---

## 设计思路

### 1. 数据分层
- 公开数据: 新闻、活动、成果、成员列表
- 用户私有数据: 个人主页、个人成果
- 管理数据: 用户管理、审核内容

### 2. 权限控制
- 通过 Convex 的 action 进行服务端权限验证
- 前端根据用户角色显示/隐藏功能

### 3. 实时性
- Convex 内置实时同步
- 使用 useQuery 自动处理缓存和更新

---

## 前端本地认证接口（开发模式）

为保证在未连接 Convex deployment 的本地开发环境中可运行，前端新增了本地认证工具：

- **实现文件**: `src/lib/mock-auth.ts`
- **会话 Hook**: `src/lib/hooks/use-auth.ts`

### 主要方法

#### `register(input)`
本地注册账号，写入浏览器 `localStorage`。

#### `signIn(identifier, password)`
使用邮箱或用户名登录并建立本地会话。

#### `signOut()`
清除当前会话。

#### `updateCurrentUser(updates)`
更新当前登录用户资料。

#### `changePassword(currentPassword, nextPassword)`
修改当前用户密码（本地开发模式）。
