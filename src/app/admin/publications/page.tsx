"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useConfirmDialog } from "@/components/ui/confirm-dialog"
import { MoreHorizontal, Plus, Search, Filter, Trash2, Edit, Eye } from "lucide-react"
import { useUsers, usePublications, useDeletePublication } from "@/lib/api"
import { getPublicationCategoryOptions } from "@/lib/publication-taxonomy"
import type { Publication } from "@/types"

export default function AdminPublicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)

  // Fetch data from Convex
  const publicationsData = usePublications({})
  const usersData = useUsers({})
  const deletePublication = useDeletePublication()

  const publications: Publication[] = publicationsData || []
  const users = usersData || []

  const { confirm, ConfirmDialog } = useConfirmDialog()

  const categoryLabelMap = useMemo(
    () => new Map(getPublicationCategoryOptions().map((option) => [option.value, option.label])),
    []
  )

  const userNameMap = useMemo(() => {
    return new Map(users.map((user) => [user._id, user.englishName]))
  }, [users])

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(publications.map((item) => item.category)))
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({
        value,
        label: categoryLabelMap.get(value) || value,
      }))
  }, [categoryLabelMap, publications])

  const filteredPublications = useMemo(() => {
    return publications.filter((publication) => {
      const query = searchQuery.trim().toLowerCase()
      const ownerName = (userNameMap.get(publication.userId) || "").toLowerCase()
      const matchesSearch =
        !query ||
        publication.title.toLowerCase().includes(query) ||
        publication.venue.toLowerCase().includes(query) ||
        publication.authors.some((author) => author.toLowerCase().includes(query)) ||
        ownerName.includes(query)
      const matchesCategory = !categoryFilter || publication.category === categoryFilter
      const matchesOwner = !ownerFilter || publication.userId === ownerFilter
      return matchesSearch && matchesCategory && matchesOwner
    })
  }, [categoryFilter, ownerFilter, publications, searchQuery, userNameMap])

  const handleDelete = async (publication: Publication) => {
    await confirm({
      title: "确认删除学术成果",
      description: `将永久删除《${publication.title}》。此操作不可撤销。`,
      confirmLabel: "删除",
      variant: "danger",
      onConfirm: () => deletePublication(publication._id),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">成果管理</h1>
          <p className="text-gray-500 mt-1">管理全站学术成果（新建、编辑、删除）</p>
        </div>
        <Button asChild className="bg-blue-900 hover:bg-blue-800">
          <Link href="/admin/publications/new">
            <Plus className="h-4 w-4 mr-2" />
            新建成果
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索标题、作者、会议期刊、归属用户..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {categoryFilter ? categoryLabelMap.get(categoryFilter) || categoryFilter : "全部领域"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCategoryFilter(null)}>全部领域</DropdownMenuItem>
                {categoryOptions.map((category) => (
                  <DropdownMenuItem key={category.value} onClick={() => setCategoryFilter(category.value)}>
                    {category.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {ownerFilter ? userNameMap.get(ownerFilter) || "未知用户" : "全部归属用户"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setOwnerFilter(null)}>全部归属用户</DropdownMenuItem>
                {users.map((user) => (
                  <DropdownMenuItem key={user._id} onClick={() => setOwnerFilter(user._id)}>
                    {user.englishName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>作者</TableHead>
                <TableHead>领域</TableHead>
                <TableHead>归属用户</TableHead>
                <TableHead>会议/期刊</TableHead>
                <TableHead>年份</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPublications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                    暂无符合条件的成果记录
                  </TableCell>
                </TableRow>
              ) : (
                filteredPublications.map((publication) => (
                  <TableRow key={publication._id}>
                    <TableCell className="font-medium max-w-[300px] truncate">{publication.title}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-gray-600">{publication.authors.join(", ")}</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-800">
                        {categoryLabelMap.get(publication.category) || publication.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{userNameMap.get(publication.userId) || "未知用户"}</TableCell>
                    <TableCell>{publication.venue}</TableCell>
                    <TableCell>{publication.year}</TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(publication.updatedAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/publications/${publication._id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              查看
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/publications/${publication._id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              编辑
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onSelect={() => handleDelete(publication)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500">共 {filteredPublications.length} 条记录</p>

      <ConfirmDialog />
    </div>
  )
}
