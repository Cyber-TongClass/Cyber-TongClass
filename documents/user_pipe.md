# User Pipeline Documentation

本文档记录了 tongclass.ac.cn 项目中不同用户角色的工作流程和数据管线。

---

## 用户角色

| 角色 | 权限 | 描述 |
|------|------|------|
| Member | 基本 | 普通成员，可编辑个人主页、上传成果 |
| Admin | 管理 | 管理员，可管理用户、审核内容 |
| Super Admin | 全部 | 超级管理员，可分配权限 |

---

## 游客 (Visitor)

### 可查看内容
- 首页 (/)
- 成员列表 (/members)
- 成果列表 (/publications)
- 新闻列表 (/news)
- 活动列表 (/events)
- 关于页面 (/about)

### 数据流
```
浏览 → 查看公开内容
```

---

## Member (注册用户)

### 注册流程

1. **预注册** (Admin操作)
   - Admin 在后台预存学号 (哈希)
   - 数据库: `users` 表

2. **用户注册**
   - 选择组织 (北大通班/清华通班)
   - 选择年级 (2020-2025)
   - 输入学号 + 邮箱 (学号@stu.pku.edu.cn)
   - 验证码验证 (接口预留)
   - 设置密码

3. **完善资料**
   - 英文名 (公开显示)
   - 用户名 (登录用，不公开)
   - 个人邮箱
   - 自我介绍 (Markdown)
   - 研究兴趣
   - Title + Link (可多个)

### 可用功能

#### 个人主页 (/users/[id])
- Profile 信息展示
- Markdown Canvas (个人画布)
- 学术成果列表

#### 成果管理 (/publications)
- 上传个人成果
- 编辑/删除个人成果

#### 课程评测 (/resources)
- 提交课程评测 (匿名)
- 查看已通过评测

### 数据流

```
注册 → 验证 → 完善资料 → 个人主页
                ↓
          上传成果 → 成果列表
                ↓
          提交评测 → 待审核 → 公开
```

---

## Admin (管理员)

### 可用功能

#### 用户管理 (/admin/users)
- 查看所有用户
- 新建用户
- 删除用户
- 修改用户信息
- 分配角色

#### 新闻管理 (/admin/news)
- 发布新闻
- 编辑新闻
- 撤回/删除新闻

#### 活动管理 (/admin/events)
- 创建活动
- 编辑活动
- 删除活动

#### 课程评测管理 (/admin/reviews)
- 审核用户提交的评测
- 修改评测内容
- 删除评测
- 合并课程名称

#### 导入数据
- 批量导入课程评测数据

### 数据流

```
用户提交 → 待审核列表 → 审核通过 → 公开
                        → 审核拒绝 → 用户收到通知
```

---

## Super Admin (超级管理员)

### 可用功能

#### 权限管理
- 分配/撤销 Admin 权限
- 查看所有用户角色

#### 所有 Admin 功能

---

## 页面访问控制

| 页面 | 游客 | Member | Admin | Super Admin |
|------|------|--------|-------|-------------|
| / | ✓ | ✓ | ✓ | ✓ |
| /members | ✓ | ✓ | ✓ | ✓ |
| /publications | ✓ | ✓ | ✓ | ✓ |
| /news | ✓ | ✓ | ✓ | ✓ |
| /events | ✓ | ✓ | ✓ | ✓ |
| /resources | - | ✓ | ✓ | ✓ |
| /users/[id] | ✓ | ✓ | ✓ | ✓ |
| /admin/* | - | - | ✓ | ✓ |

---

## API 权限映射

| API | 游客 | Member | Admin |
|-----|------|--------|-------|
| users:list | - | - | ✓ |
| users:getById | - | Own | ✓ |
| users:create | - | - | ✓ |
| users:update | - | Own | ✓ |
| users:updateRole | - | - | - |
| publications:list | ✓ | ✓ | ✓ |
| publications:create | - | ✓ | ✓ |
| publications:update | - | Own | ✓ |
| publications:delete | - | Own | ✓ |
| news:list | ✓ | ✓ | ✓ |
| news:create | - | - | ✓ |
| news:update | - | - | ✓ |
| news:delete | - | - | ✓ |
| events:* | ✓ | ✓ | - |
| courseReviews:create | - | ✓ | ✓ |
| courseReviews:approve | - | - | ✓ |

---

## 数据表关系

```
users (1) ────────── (N) publications
users (1) ────────── (N) news
users (1) ────────── (N) events
users (1) ────────── (N) courseReviews

courseReviews (N) ── (1) courses (虚拟)
```

---

## 安全考虑

1. **密码哈希**: 使用 bcrypt 或类似算法
2. **学号验证**: 预存哈希值，注册时对比
3. **会话管理**: Convex Auth 内置
4. **API权限**: 服务端验证
5. **高危操作**: 二次确认弹窗
