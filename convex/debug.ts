import { query } from "./_generated/server"

export default query({
  handler: async (ctx) => {
    const news = await ctx.db.query("news").collect()
    return {
      count: news.length,
      news: news.map(n => ({
        title: n.title,
        isPublished: n.isPublished,
        authorId: n.authorId,
      }))
    }
  },
})
