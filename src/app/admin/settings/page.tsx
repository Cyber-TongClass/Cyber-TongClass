import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">后台设置</h1>
        <p className="text-gray-500 mt-1">管理后台基础配置（本地演示）</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>站点配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">站点名称</Label>
            <Input id="siteName" defaultValue="Tong Class" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">联系邮箱</Label>
            <Input id="contactEmail" defaultValue="contact@tongclass.ac.cn" />
          </div>
          <Button>保存设置</Button>
        </CardContent>
      </Card>
    </div>
  )
}
