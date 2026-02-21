Prompt


这是通班官方网站下一代版本 **tongclass.ac.cn** 的仓库。

---

## 工程要求

1. 需要自动适配桌面端和移动端的不同屏幕尺寸，避免组件重叠/文字异常换行，内容过宽。
2. 整个项目要可以打包为一个docker app，做好上传github、本地测试、服务端三份env文件，以现代网页安全性要求与调试便捷性为要求构建项目。
3. 在repo根目录的documents文件夹写清楚以下几个文件：
    - api.md 记录所有的api接口与使用方法、以及你的思路，创建与编辑新的api需要同步调整本文档并确保风格一致统一。
    - tools.md 记录所有的tool使用方法与作用、以及你的思路，创建与编辑新的tool需要同步调整本文档并确保风格一致统一。
    - user_pipe.md 记录用户管线，即每种用户分别可以做什么，对应数据如何传递处理，用户可以看到什么东西。
    - module.md 记录网页功能，为网页的不同功能提供文字具体描述，记录pipes。
    - agent_coll.md 工程进行中会有多个agent同时工作。你需要先阅读本doc中其他agent已经在完成或者已完成的进展，了解项目进程后在本文件里append你选择的分工责任。及时更新，反复阅读，不用担心token消耗。
    - search.md 任何你不能确定的技术细节可以查阅互联网，但每次查阅后必须在search.md中记录你search的主题/结果与是否采用等状态。
    - todo.md 后续更新可继续扩展的内容。

    文件中要有对应功能的实现文件引用；doc结构要方便后续继续append。
4. 要有统一的工程样式库，例如配色/样式库。在使用的时候可以从中进行选择，如果要创建新工具及时增加到样式库中。全站容器宽度、间距规范。
5. **每次开始完成一项任务必须新建git分支；每实现一个功能/增加一种tool/配色或者样式或者api，都需要进行commit并push到develop分支。每次开始新工程编辑时，要及时从develop更新最新的commit。**
6. 用户进行高危操作时需要弹窗二次确认。


---


## 前端设计

技术栈：

- Next.js
- Shadcn/UI

设计风格参考：

- Stanford（学术）
- Yale（简洁）
- Cambridge CSS（现代）

最终倾向：**Yale 风格**

Instead of emojis, use icons. Fix the padding so every component is spaced perfectly - not too close to other components but not too dispersed to waste space.

The goal of the site is to look sleek, premium, and minimalist, like aspa in Switzerland. 

Design this in a way that matches what a working professional would reasonably pay thousands of dollars a month for, in a way that would make Steve Jobs smile.

Avoid using colors unnecessarily, instead pick from a palette that is cohesive and stick to it. Ensure the site is responsive and elegant on both desktop and mobile.

---

## 基本信息

主域名：
- https://tongclass.ac.cn/

旧版迁移：
- https://nostalgic.tongclass.ac.cn/

北京大学人工智能研究院
- https://www.ai.pku.edu.cn/

---

## 当前架构流程

Database (Convex) → API (TypeScript) → Next.js → Shadcn/UI → Browser

---

## 后端设计

### 账户类型

- Member
- Admin
- Super Admin

---

### Member 功能

- 编辑并展示个人主页
- 使用Markdown编辑个人画布
- 成果（paper）上传
- Scholar / ORCID 信息

---

### Admin 功能

- 仓库完全权限
- 管理后台 Dashboard
- 新建或删除Member用户（提供姓名/学号/组织）
- 修改/编辑Member的信息
- 修改/编辑/删除课程测评论坛信息

---

### Super Admin 功能

- 调整其他用户的权限
- Admin的所有权限

### 后端技术方案

使用 **Convex** 作为 BaaS：

优势：
- 无服务器架构
- 内置数据库
- 实时同步
- 简单 API

---

### 注册流程

1. Admin/SuperAdmin 预存学号数据库（哈希）
2. Member注册时 下拉框选择组织，输入 学号 + 邮箱
    - 下拉框为二级下拉框，分别为
        - 北大通班（学号@stu.pku.edu.cn）
            - 2020级
            - 2021级
            - ...到今年（2025级）
        - 清华通班
            - 2020级
            - 2021级
            - ...到今年（2025级）
3. call一次邮件验证（这里先保留接口，暂时不完成）
4. 输入验证码并设置密码
5. 完善资料
    - 英文名（展示在主页）
    - 用户名（可用于用户名+密码登录，登录时映射到对应的email，用户名唯一且不公开展示）
    - 个人邮箱（不默认作为登录邮箱）
    - 自我介绍（markdown实时左侧编辑右侧渲染）
    - 研究兴趣
    - title + link（两个空）（可以自己增减数量，在最后一个填写框右侧防止增减号）

修改邮箱或密码 → 需重新验证

---

### 用户主页

URL 结构：

```
tongclass.ac.cn/users/
```

每位用户拥有：

- Profile Page
- Markdown Canvas
- 学术成果页（个人published的list，每一行可以跳转到一个**成果系统**页面）
    - 在作者列加粗该用户英文名（自动检索），其余作者不加粗
    - Abstract仅在成果页面内部展示，不在list里展示。其余信息全部展示。


---

### 成果系统

存储字段：

- title
- authors
- 领域
    - 二级下拉菜单
        ML: Machine Learning,
            supervised learning,
            unsupervised learning,
            semi-supervised learning,
            self-supervised learning,
            representation learning,
            optimization,
            generalization,
            theory,
            Deep Learning,
            architectures,
            training methods,
            scaling laws,
            efficiency,
            pruning,
            quantization

        CV: Computer Vision,
            image understanding,
            video understanding,
            detection,
            segmentation,
            3D vision,
            vision-language

        NLP: Natural Language Processing,
            language modeling,
            machine translation,
            information extraction,
            dialogue,
            multilingual NLP,
            reasoning

        MM: Multimodal AI,
            vision-language,
            audio-language,
            multimodal reasoning,
            multimodal generation

        GEN: Generative Modeling,
            diffusion,
            autoregressive,
            flow models,
            VAEs,
            controllable generation

        RL: Reinforcement Learning,
            policy learning,
            offline RL,
            planning,
            exploration,
            decision making

        MAS: Multi-Agent Systems,
            cooperation,
            competition,
            game theory,
            communication learning

        ROB: Robotics,
            manipulation,
            navigation,
            control,
            sim2real,
            embodied learning

        SYS: AI Systems,
            distributed training,
            efficient inference,
            hardware-aware learning,
            compilation,
            deployment

        SAFE: AI Safety,
            alignment,
            interpretability,
            robustness,
            fairness,
            privacy

        KA: Knowledge & Reasoning,
            knowledge graphs,
            symbolic AI,
            neuro-symbolic,
            logical reasoning,
            causal reasoning

        SCI: AI for Science,
            chemistry,
            biology,
            physics,
            materials,
            climate,
            medicine

        HCI: Human-AI Interaction,
            human feedback,
            interactive learning,
            usability,
            personalization

        APP: Applications,
            recommendation,
            finance,
            education,
            healthcare,
            industry
- venue
- 发表年份
- abstract
- url（e.g. arxiv）

表名：`publications`

可扩展：

- 从Google Scholar自动同步

---

### 课程测评论坛

功能目标：

- 内部 BBS
- 匿名评价
- Admin审核发布

- 支持Admin导入已有问卷数据
    - 课程名称（必填）
    - 开课学期（必填）
    - 评分（0-10）（必填）
    - 详情
- 开放用户投稿接口
    - 课程名称（必填）
    - 开课学期（必填）
    - 评分（0-10）（必填）
    - 详情
- admin可以审核展示、修改已有课程测评数据
- 每个不同的课程名称都可以点开一个page，里面有所有同课程测评的post list和平均打分。
- 相同课程名的page自动合并。（admin可能修改课程名称使得相同课程的不同名称有同样的名字，因此要每次点开page检索，也可以并查集加快搜索）admin还要可以直接在课程page页面修改课程名称，所有原本以此为课程名称的post的课程名称都需要更新。

- 支持按照课程名称检索
- 支持按照评分/发布时间调整展示顺序

---

### 新闻与日历系统

数据库表/list页面：

- news
    - list可以是列表式，展示title/署名/分类/time
        - 分类如官方公告、成果发布、活动回顾等等
    - 只有admin及以上权限才能编写发布
    - 编写时调用markdown编辑器，左侧md右侧实时渲染
    - 新闻title/署名/time都可以被手动指定，title、分类必填，其余不必须，留空则默认发表者英文名+当前时间。
    - admin可以编辑/撤回已经发表的新闻。

- events
    - 每个event一个block，block里有event名称/时间（或时间段）
    - 每个block可以点开到page里面除了上面的信息外还有location和description
    - event将在日历组件中展示，不同event具有不同的颜色，固定映射并存colorKey，用户可以在日历里点击每个色块以显示活动名称/简介/详情链接（「查看更多」按钮）。点开查看更多按钮后，可以跳转到event页面，该页面即在list中直接点进该event的page。

四个页面：

- Markdown 新闻 list
- Event block list
- React 日历组件
- Admin 可视化管理

---


## 页面结构

### 顶部导航

包含：

- Logo（已放置到repo中，名为logo.png）
- 菜单
- 搜索栏
- 登录按钮

菜单：

- 动态
- 成员
- 成果
- 资源（需登录才显示）
- 活动
- 关于

---

### 首页模块

1. 轮播新闻 Banner
2. 简介区
3. 最新新闻

---

### 新闻页

支持：
- 分类筛选
- 按发布者筛选
- 时间筛选
- 时间轴布局

---

### 成员页

排序规则：

1. 学校
2. 年级（新→旧）
3. 拼音

- 可筛选tag
- list里每个人的行都可以点进其member homepage

---

### 成果页
所有人的成果汇总的list
模块：

- Latest Works
- Archive

支持：

- 可搜索作者/题目
- 可按照名称/领域/发布时间排序和筛选

---

### 资源页

博客风格

重点：课程测评论坛

---

### 活动页

字段：

- title
- date
- time
- location
- description

---

### 关于页

Docs 结构：

PKU / THU
├ Introduction
├ Official Accounts
├ Campus Life
├ Student Council
├ Merchandise
└ Contact

支持返回旧版网站按钮
