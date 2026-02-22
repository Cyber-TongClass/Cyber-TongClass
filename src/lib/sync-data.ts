/**
 * 跨标签页同步的数据存储
 * 使用 BroadcastChannel API 实现同一浏览器不同标签页之间的数据同步
 * 使用 IndexedDB 实现持久化存储
 */

// 检查是否在浏览器环境
const isBrowser = typeof window !== "undefined"

// BroadcastChannel 用于跨标签页通信 (仅在浏览器环境)
let newsChannel: BroadcastChannel | null = null
let eventsChannel: BroadcastChannel | null = null
let publicationsChannel: BroadcastChannel | null = null
let courseReviewsChannel: BroadcastChannel | null = null

if (isBrowser) {
  newsChannel = new BroadcastChannel("tongclass_news_sync")
  eventsChannel = new BroadcastChannel("tongclass_events_sync")
  publicationsChannel = new BroadcastChannel("tongclass_publications_sync")
  courseReviewsChannel = new BroadcastChannel("tongclass_courseReviews_sync")
}

// IndexedDB 配置
const DB_NAME = "tongclass_db"
const DB_VERSION = 1

interface DBSchema {
  news: News[]
  events: Event[]
  publications: Publication[]
  courseReviews: CourseReview[]
}

// 初始化 IndexedDB
let db: IDBDatabase | null = null

async function initDB(): Promise<IDBDatabase> {
  if (!isBrowser) {
    throw new Error("IndexedDB is not available in server-side rendering")
  }

  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      // 创建对象存储
      if (!database.objectStoreNames.contains("news")) {
        database.createObjectStore("news", { keyPath: "_id" })
      }
      if (!database.objectStoreNames.contains("events")) {
        database.createObjectStore("events", { keyPath: "_id" })
      }
      if (!database.objectStoreNames.contains("publications")) {
        database.createObjectStore("publications", { keyPath: "_id" })
      }
      if (!database.objectStoreNames.contains("courseReviews")) {
        database.createObjectStore("courseReviews", { keyPath: "_id" })
      }
    }
  })
}

// 从 IndexedDB 读取数据
async function readFromIDB<T>(storeName: keyof DBSchema): Promise<T[]> {
  // 在 SSR 环境下返回空数组
  if (!isBrowser) {
    return []
  }

  try {
    const database = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  } catch (error) {
    console.error("Failed to read from IndexedDB:", error)
    return []
  }
}

// 写入 IndexedDB
async function writeToIDB<T extends { _id: string }>(
  storeName: keyof DBSchema,
  data: T[]
): Promise<void> {
  // 在 SSR 环境下不写入
  if (!isBrowser) {
    return
  }

  try {
    const database = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, "readwrite")
      const store = transaction.objectStore(storeName)

      // 清空并重新写入
      store.clear()
      data.forEach((item) => store.put(item))

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  } catch (error) {
    console.error("Failed to write to IndexedDB:", error)
  }
}

// 生成唯一ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 新闻相关类型
export interface News {
  _id: string
  title: string
  content: string
  authorId: string
  authorName?: string
  category: string
  publishedAt: number
  isPublished: boolean
  createdAt: number
  updatedAt: number
}

// 事件相关类型
export interface Event {
  _id: string
  title: string
  date: string
  time?: string
  endDate?: string
  endTime?: string
  location?: string
  description?: string
  url?: string
  color: string
  createdAt: number
  updatedAt: number
}

// 论文相关类型
export interface Publication {
  _id: string
  title: string
  authors: string[]
  venue: string
  year: number
  abstract: string
  url?: string
  category: string
  subCategory?: string
  userId: string
  createdAt: number
  updatedAt: number
}

// 课程评价相关类型
export interface CourseReview {
  _id: string
  courseName: string
  semester: string
  rating: number
  content: string
  isAnonymous: boolean
  authorId?: string
  status: "pending" | "approved" | "rejected"
  createdAt: number
  updatedAt: number
}

// 种子数据
const seedNews: News[] = [
  {
    _id: "news-1",
    title: "欢迎来到通班网站",
    content: "这是通班官方网站，我们致力于分享学术成果和活动信息。",
    authorId: "system",
    authorName: "管理员",
    category: "通知公告",
    publishedAt: Date.now() - 86400000 * 7,
    isPublished: true,
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 7,
  },
]

const seedEvents: Event[] = [
  {
    _id: "event-1",
    title: "新生欢迎会",
    date: "2024-09-15",
    time: "14:00",
    location: "北京大学",
    description: "欢迎新同学加入通班大家庭",
    color: "#3b82f6",
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 30,
  },
]

// 新闻操作
export async function getNews(): Promise<News[]> {
  // 在 SSR 环境下返回空数组
  if (!isBrowser) {
    return []
  }

  try {
    const news = await readFromIDB<News>("news")
    if (news.length === 0) {
      // 初始化种子数据
      await writeToIDB("news", seedNews)
      return seedNews
    }
    return news.sort((a, b) => b.publishedAt - a.publishedAt)
  } catch (error) {
    console.error("Failed to get news from IndexedDB:", error)
    return seedNews
  }
}

export async function getNewsById(id: string): Promise<News | undefined> {
  // 在 SSR 环境下返回 undefined
  if (!isBrowser) {
    return undefined
  }

  const news = await getNews()
  return news.find((n) => n._id === id)
}

export async function addNews(
  newsData: Omit<News, "_id" | "createdAt" | "updatedAt">
): Promise<News> {
  const allNews = await getNews()
  const newItem: News = {
    ...newsData,
    _id: `news-${generateId()}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  const newData = [newItem, ...allNews]
  await writeToIDB("news", newData)

  // 广播更新
  newsChannel?.postMessage({ type: "update", data: newData })

  return newItem
}

export async function updateNews(
  id: string,
  updates: Partial<News>
): Promise<News | undefined> {
  const allNews = await getNews()
  const index = allNews.findIndex((n) => n._id === id)
  if (index === -1) return undefined

  const updated: News = {
    ...allNews[index],
    ...updates,
    updatedAt: Date.now(),
  }
  allNews[index] = updated
  await writeToIDB("news", allNews)

  // 广播更新
  newsChannel?.postMessage({ type: "update", data: allNews })

  return updated
}

export async function deleteNews(id: string): Promise<boolean> {
  const allNews = await getNews()
  const filtered = allNews.filter((n) => n._id !== id)
  if (filtered.length === allNews.length) return false
  await writeToIDB("news", filtered)

  // 广播更新
  newsChannel?.postMessage({ type: "update", data: filtered })

  return true
}

// 事件操作
export async function getEvents(): Promise<Event[]> {
  try {
    const events = await readFromIDB<Event>("events")
    if (events.length === 0) {
      await writeToIDB("events", seedEvents)
      return seedEvents
    }
    return events.sort((a, b) => a.date.localeCompare(b.date))
  } catch (error) {
    console.error("Failed to get events from IndexedDB:", error)
    return seedEvents
  }
}

export async function addEvent(
  eventData: Omit<Event, "_id" | "createdAt" | "updatedAt">
): Promise<Event> {
  const allEvents = await getEvents()
  const newItem: Event = {
    ...eventData,
    _id: `event-${generateId()}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  const newData = [newItem, ...allEvents]
  await writeToIDB("events", newData)

  eventsChannel?.postMessage({ type: "update", data: newData })

  return newItem
}

export async function deleteEvent(id: string): Promise<boolean> {
  const allEvents = await getEvents()
  const filtered = allEvents.filter((e) => e._id !== id)
  if (filtered.length === allEvents.length) return false
  await writeToIDB("events", filtered)

  eventsChannel?.postMessage({ type: "update", data: filtered })

  return true
}

// 论文操作
export async function getPublications(): Promise<Publication[]> {
  try {
    const publications = await readFromIDB<Publication>("publications")
    return publications.sort((a, b) => b.year - a.year)
  } catch (error) {
    console.error("Failed to get publications from IndexedDB:", error)
    return []
  }
}

export async function addPublication(
  pubData: Omit<Publication, "_id" | "createdAt" | "updatedAt">
): Promise<Publication> {
  const allPubs = await getPublications()
  const newItem: Publication = {
    ...pubData,
    _id: `pub-${generateId()}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  const newData = [newItem, ...allPubs]
  await writeToIDB("publications", newData)

  publicationsChannel?.postMessage({ type: "update", data: newData })

  return newItem
}

export async function deletePublication(id: string): Promise<boolean> {
  const allPubs = await getPublications()
  const filtered = allPubs.filter((p) => p._id !== id)
  if (filtered.length === allPubs.length) return false
  await writeToIDB("publications", filtered)

  publicationsChannel?.postMessage({ type: "update", data: filtered })

  return true
}

// 课程评价操作
export async function getCourseReviews(): Promise<CourseReview[]> {
  try {
    const reviews = await readFromIDB<CourseReview>("courseReviews")
    return reviews
  } catch (error) {
    console.error("Failed to get course reviews from IndexedDB:", error)
    return []
  }
}

export async function addCourseReview(
  reviewData: Omit<CourseReview, "_id" | "createdAt" | "updatedAt">
): Promise<CourseReview> {
  const allReviews = await getCourseReviews()
  const newItem: CourseReview = {
    ...reviewData,
    _id: `review-${generateId()}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  const newData = [newItem, ...allReviews]
  await writeToIDB("courseReviews", newData)

  courseReviewsChannel?.postMessage({ type: "update", data: newData })

  return newItem
}

export async function updateCourseReview(
  id: string,
  updates: Partial<CourseReview>
): Promise<CourseReview | undefined> {
  const allReviews = await getCourseReviews()
  const index = allReviews.findIndex((r) => r._id === id)
  if (index === -1) return undefined

  const updated: CourseReview = {
    ...allReviews[index],
    ...updates,
    updatedAt: Date.now(),
  }
  allReviews[index] = updated
  await writeToIDB("courseReviews", allReviews)

  courseReviewsChannel?.postMessage({ type: "update", data: allReviews })

  return updated
}

// 监听跨标签页更新
export function subscribeToNewsUpdates(
  callback: (news: News[]) => void
): () => void {
  if (!isBrowser || !newsChannel) return () => {}

  const handler = (event: MessageEvent) => {
    if (event.data.type === "update") {
      callback(event.data.data)
    }
  }
  newsChannel.addEventListener("message", handler)
  return () => newsChannel.removeEventListener("message", handler)
}

export function subscribeToEventsUpdates(
  callback: (events: Event[]) => void
): () => void {
  if (!isBrowser || !eventsChannel) return () => {}

  const handler = (event: MessageEvent) => {
    if (event.data.type === "update") {
      callback(event.data.data)
    }
  }
  eventsChannel.addEventListener("message", handler)
  return () => eventsChannel.removeEventListener("message", handler)
}

export function subscribeToPublicationsUpdates(
  callback: (publications: Publication[]) => void
): () => void {
  if (!isBrowser || !publicationsChannel) return () => {}

  const handler = (event: MessageEvent) => {
    if (event.data.type === "update") {
      callback(event.data.data)
    }
  }
  publicationsChannel.addEventListener("message", handler)
  return () => publicationsChannel.removeEventListener("message", handler)
}

export function subscribeToCourseReviewsUpdates(
  callback: (reviews: CourseReview[]) => void
): () => void {
  if (!isBrowser || !courseReviewsChannel) return () => {}

  const handler = (event: MessageEvent) => {
    if (event.data.type === "update") {
      callback(event.data.data)
    }
  }
  courseReviewsChannel.addEventListener("message", handler)
  return () => courseReviewsChannel.removeEventListener("message", handler)
}

// 初始化数据库 (仅在浏览器环境)
if (isBrowser) {
  initDB().catch(console.error)
}
