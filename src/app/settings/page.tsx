"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { useUpdateUser, useUserById, useCurrentUser } from "@/lib/api"
import { normalizeUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Camera, User } from "lucide-react"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export default function SettingsPage() {
  const router = useRouter()
  const { currentUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const updateUser = useUpdateUser()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")
  
  // Profile form
  const [englishName, setEnglishName] = useState("")
  const [personalEmail, setPersonalEmail] = useState("")
  const [bio, setBio] = useState("")
  const [researchInterests, setResearchInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState("")
  const [scholarUrl, setScholarUrl] = useState("")
  const [orcidUrl, setOrcidUrl] = useState("")
  
  // Password form
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Title/Links
  const [titles, setTitles] = useState<{ title: string; link: string }[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newLink, setNewLink] = useState("")

  // Avatar & Real Photo
  const [avatar, setAvatar] = useState<string | undefined>(undefined)
  const [realPhoto, setRealPhoto] = useState<string | undefined>(undefined)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [realPhotoPreview, setRealPhotoPreview] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const realPhotoInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      setError("头像图片大小不能超过2MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setAvatar(result)
      setAvatarPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleRealPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      setError("真实照片大小不能超过2MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setRealPhoto(result)
      setRealPhotoPreview(result)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (currentUser) {
      setEnglishName(currentUser.englishName || "")
      setPersonalEmail(currentUser.personalEmail || "")
      setBio(currentUser.bio || "")
      setResearchInterests(currentUser.researchInterests || [])
      setScholarUrl(currentUser.scholarUrl || "")
      setOrcidUrl(currentUser.orcidUrl || "")
      setTitles(currentUser.titles || [])
      setAvatar(currentUser.avatar)
      setRealPhoto(currentUser.realPhoto)
      if (currentUser.avatar) setAvatarPreview(currentUser.avatar)
      if (currentUser.realPhoto) setRealPhotoPreview(currentUser.realPhoto)
    }
  }, [currentUser])

  const handleSaveProfile = async () => {
    if (!currentUser) return
    
    setIsSubmitting(true)
    setError("")
    setSuccessMessage("")
    
    try {
      await updateUser({
        id: currentUser._id,
        englishName,
        personalEmail: personalEmail || undefined,
        bio: bio || undefined,
        researchInterests: researchInterests.length > 0 ? researchInterests : undefined,
        scholarUrl: scholarUrl || undefined,
        orcidUrl: orcidUrl || undefined,
        titles: titles.length > 0 ? titles : undefined,
        avatar,
      })

      setSuccessMessage("Profile updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddInterest = () => {
    if (newInterest && !researchInterests.includes(newInterest)) {
      setResearchInterests([...researchInterests, newInterest])
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (interest: string) => {
    setResearchInterests(researchInterests.filter(i => i !== interest))
  }

  const handleAddTitle = () => {
    if (newTitle && newLink) {
      setTitles([...titles, { title: newTitle, link: newLink }])
      setNewTitle("")
      setNewLink("")
    }
  }

  const handleRemoveTitle = (index: number) => {
    setTitles(titles.filter((_, i) => i !== index))
  }

  const handleChangePassword = async () => {
    // Password change requires Convex Auth to be fully configured
    // For now, we'll show a message that this feature needs to be implemented
    setError("Password change is not yet available with the new authentication system. Please contact the administrator.")
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        
        {successMessage && (
          <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your public profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar & Real Photo Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar */}
              <div className="space-y-2">
                <Label>头像 (用于个人主页等)</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      上传头像
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">不超过2MB</p>
                  </div>
                </div>
              </div>

              {/* Real Photo */}
              <div className="space-y-2">
                <Label>真实照片 (用于成员页面展示)</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                    {realPhotoPreview ? (
                      <img src={realPhotoPreview} alt="Real Photo" className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      ref={realPhotoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleRealPhotoChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => realPhotoInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      上传照片
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">不超过2MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organization</Label>
                <Input value={currentUser.organization === "pku" ? "北大通班" : "清华通班"} disabled />
              </div>
              <div className="space-y-2">
                <Label>Cohort</Label>
                <Input value={`${currentUser.cohort}级`} disabled />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="englishName">English Name *</Label>
              <Input
                id="englishName"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                placeholder="Your public display name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personalEmail">Personal Email</Label>
              <Input
                id="personalEmail"
                type="email"
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                placeholder="your.personal@email.com"
              />
              <p className="text-xs text-muted-foreground">
                Changing email requires verification
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Research Interests</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add research interest"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInterest())}
                />
                <Button type="button" variant="outline" onClick={handleAddInterest}>
                  Add
                </Button>
              </div>
              {researchInterests.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {researchInterests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scholarUrl">Google Scholar URL</Label>
                <Input
                  id="scholarUrl"
                  value={scholarUrl}
                  onChange={(e) => setScholarUrl(e.target.value)}
                  placeholder="https://scholar.google.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orcidUrl">ORCID</Label>
                <Input
                  id="orcidUrl"
                  value={orcidUrl}
                  onChange={(e) => setOrcidUrl(e.target.value)}
                  placeholder="https://orcid.org/..."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Title & Links</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Page Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Input
                  placeholder="Link URL"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleAddTitle}>
                  Add
                </Button>
              </div>
              {titles.length > 0 && (
                <div className="space-y-2 mt-2">
                  {titles.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{item.title}</span>
                      <a href={normalizeUrl(item.link)} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                        {item.link}
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTitle(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleChangePassword}>
              Change Password
            </Button>
          </CardFooter>
        </Card>
        
        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{currentUser.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Student ID</span>
              <span className="font-medium">{currentUser.studentId}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium capitalize">{currentUser.role.replace("_", " ")}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
