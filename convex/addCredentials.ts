/**
 * 添加种子用户凭据
 */

import { mutation } from "./_generated/server"

export default mutation({
  handler: async (ctx) => {
    // 查找现有用户
    const admin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "admin@tongclass.ac.cn"))
      .first()
    
    const member = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "member@pku.edu.cn"))
      .first()

    // 检查是否已有凭据
    if (admin) {
      const existingCred = await ctx.db
        .query("authCredentials")
        .filter((q) => q.eq(q.field("userId"), admin._id))
        .first()
      
      if (!existingCred) {
        await ctx.db.insert("authCredentials", {
          userId: admin._id,
          passwordHash: "admin123",
        })
      }
    }

    if (member) {
      const existingCred = await ctx.db
        .query("authCredentials")
        .filter((q) => q.eq(q.field("userId"), member._id))
        .first()
      
      if (!existingCred) {
        await ctx.db.insert("authCredentials", {
          userId: member._id,
          passwordHash: "member123",
        })
      }
    }

    return { success: true, message: "Credentials added" }
  },
})
