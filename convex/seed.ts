/**
 * 种子数据 - 用于初始化数据库
 */

import { mutation } from "./_generated/server"

export default mutation({
  handler: async (ctx) => {
    const now = Date.now()

    // 强制删除现有数据并重新创建
    // 删除所有现有用户
    const existingUsers = await ctx.db.query("users").collect()
    for (const user of existingUsers) {
      await ctx.db.delete(user._id)
    }

    // 删除所有现有新闻
    const existingNews = await ctx.db.query("news").collect()
    for (const news of existingNews) {
      await ctx.db.delete(news._id)
    }

    // 删除所有现有活动
    const existingEvents = await ctx.db.query("events").collect()
    for (const event of existingEvents) {
      await ctx.db.delete(event._id)
    }

    // 删除所有现有课程
    const existingCourses = await ctx.db.query("courses").collect()
    for (const course of existingCourses) {
      await ctx.db.delete(course._id)
    }

    // 删除所有现有课程评价
    const existingReviews = await ctx.db.query("courseReviews").collect()
    for (const review of existingReviews) {
      await ctx.db.delete(review._id)
    }

    // 删除所有现有出版物
    const existingPubs = await ctx.db.query("publications").collect()
    for (const pub of existingPubs) {
      await ctx.db.delete(pub._id)
    }

    // 删除所有现有凭据
    const existingCreds = await ctx.db.query("authCredentials").collect()
    for (const cred of existingCreds) {
      await ctx.db.delete(cred._id)
    }

    // 创建种子用户
    const adminId = await ctx.db.insert("users", {
      email: "admin@tongclass.ac.cn",
      username: "admin",
      englishName: "Admin User",
      role: "admin",
      organization: "pku",
      cohort: 2024,
      studentId: "2024000001",
      personalEmail: "admin@tongclass.ac.cn",
      bio: "System admin",
      researchInterests: ["Administration"],
      titles: [],
      scholarUrl: "",
      orcidUrl: "",
      avatar: "",
      isEmailVerified: true,
      createdAt: now,
      updatedAt: now,
    })

    // 创建管理员凭据
    await ctx.db.insert("authCredentials", {
      userId: adminId,
      passwordHash: "admin123",
    })

    const memberId = await ctx.db.insert("users", {
      email: "member@pku.edu.cn",
      username: "member",
      englishName: "Zhang San",
      role: "member",
      organization: "pku",
      cohort: 2024,
      studentId: "2024000002",
      personalEmail: "member@pku.edu.cn",
      bio: "AI researcher",
      researchInterests: ["Machine Learning", "Computer Vision"],
      titles: [],
      scholarUrl: "",
      orcidUrl: "",
      avatar: "",
      isEmailVerified: true,
      createdAt: now,
      updatedAt: now,
    })

    // 创建成员凭据
    await ctx.db.insert("authCredentials", {
      userId: memberId,
      passwordHash: "member123",
    })

    // 创建种子新闻
    await ctx.db.insert("news", {
      title: "欢迎来到通班网站",
      content: "这是通班官方网站，我们致力于分享学术成果和活动信息。",
      authorId: adminId,
      authorName: "管理员",
      category: "通知公告",
      publishedAt: now - 86400000 * 7,
      isPublished: true,
      createdAt: now - 86400000 * 7,
      updatedAt: now - 86400000 * 7,
    })

    await ctx.db.insert("news", {
      title: "通班学生获ICML 2024最佳论文奖",
      content: "恭喜通班学生XXX在ICML 2024获得最佳论文奖！这是在机器学习领域顶级会议上获得的殊荣。",
      authorId: adminId,
      authorName: "王老师",
      category: "学术成果",
      publishedAt: now - 86400000 * 3,
      isPublished: true,
      createdAt: now - 86400000 * 3,
      updatedAt: now - 86400000 * 3,
    })

    await ctx.db.insert("news", {
      title: "2024年春季学期课程安排发布",
      content: "2024年春季学期课程安排已发布，请同学们查看具体课程时间和上课地点。",
      authorId: adminId,
      authorName: "教务处",
      category: "课程安排",
      publishedAt: now - 86400000 * 1,
      isPublished: true,
      createdAt: now - 86400000 * 1,
      updatedAt: now - 86400000 * 1,
    })

    // 创建种子活动
    await ctx.db.insert("events", {
      title: "通班学术沙龙",
      date: "2026-03-15",
      time: "14:00-16:00",
      location: "北京大学光华楼",
      description: "邀请业界专家分享最新的AI研究成果",
      color: "#0F4C81",
      url: "",
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.insert("events", {
      title: "春季学期开学典礼",
      date: "2026-02-20",
      time: "09:00-11:00",
      location: "清华大学主楼",
      description: "新学期开学典礼暨新生欢迎会",
      color: "#DC143C",
      url: "",
      createdAt: now,
      updatedAt: now,
    })

    // 创建种子课程
    await ctx.db.insert("courses", {
      name: "人工智能导论",
      instructor: "张教授",
      department: "智能科学与技术系",
      reviewCount: 2,
      averageRating: 8.5,
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.insert("courses", {
      name: "机器学习",
      instructor: "李教授",
      department: "计算机科学与技术系",
      reviewCount: 1,
      averageRating: 10,
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.insert("courses", {
      name: "深度学习",
      instructor: "王教授",
      department: "人工智能研究院",
      reviewCount: 2,
      averageRating: 8.5,
      createdAt: now,
      updatedAt: now,
    })

    // 创建种子课程评价
    await ctx.db.insert("courseReviews", {
      courseName: "人工智能导论",
      semester: "2024春",
      rating: 9,
      content: "老师讲得很好，收获很大！",
      isAnonymous: true,
      status: "approved",
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.insert("courseReviews", {
      courseName: "人工智能导论",
      semester: "2023秋",
      rating: 8,
      content: "课程内容充实，推荐选课。",
      isAnonymous: true,
      status: "approved",
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.insert("courseReviews", {
      courseName: "机器学习",
      semester: "2024春",
      rating: 10,
      content: "非常经典的ML课程，老师水平很高。",
      isAnonymous: true,
      status: "approved",
      createdAt: now,
      updatedAt: now,
    })

    // 创建种子出版物
    await ctx.db.insert("publications", {
      title: "Efficient Deep Learning for Image Classification",
      authors: ["Zhang San", "Li Si", "Wang Wu"],
      venue: "CVPR 2024",
      year: 2024,
      abstract: "We present a novel efficient deep learning method for image classification.",
      url: "https://arxiv.org",
      category: "Computer Vision",
      subCategory: "image understanding",
      userId: memberId,
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.insert("publications", {
      title: "Robust Neural Networks against Adversarial Attacks",
      authors: ["Zhang San", "Chen Liu"],
      venue: "ICML 2024",
      year: 2024,
      abstract: "We investigate the capability of large language models in code generation tasks.",
      url: "https://arxiv.org",
      category: "Machine Learning",
      subCategory: "theory",
      userId: memberId,
      createdAt: now,
      updatedAt: now,
    })

    return {
      success: true,
      message: "Seed data created successfully!",
    }
  },
})
