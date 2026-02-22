"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { normalizeUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSignUp, useSignIn, useCurrentUser } from "@/lib/api"

type Organization = "pku" | "thu"

const CURRENT_YEAR = new Date().getFullYear()
const cohortOptions = Array.from({ length: CURRENT_YEAR - 2019 }, (_, idx) => CURRENT_YEAR - idx)

const ORGANIZATIONS: Record<Organization, { label: string; cohorts: number[] }> = {
  pku: {
    label: "北大通班",
    cohorts: cohortOptions,
  },
  thu: {
    label: "清华通班",
    cohorts: cohortOptions,
  },
}

export default function RegisterPage() {
  const router = useRouter()
  const signUp = useSignUp()
  const signIn = useSignIn()
  const currentUser = useCurrentUser()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data
  const [organization, setOrganization] = useState<Organization | "">("")
  const [cohort, setCohort] = useState<number | "">("")
  const [studentId, setStudentId] = useState("")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Profile data
  const [englishName, setEnglishName] = useState("")
  const [username, setUsername] = useState("")
  const [personalEmail, setPersonalEmail] = useState("")
  const [bio, setBio] = useState("")
  const [researchInterests, setResearchInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState("")
  const [titles, setTitles] = useState<{ title: string; link: string }[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newLink, setNewLink] = useState("")

  const getExpectedEmailHint = () => {
    if (organization === "pku") {
      return `${studentId || "your_student_id"}@stu.pku.edu.cn`
    }
    return `${studentId || "your_student_id"}@mails.tsinghua.edu.cn`
  }

  const validateStep1 = () => {
    if (!organization || !cohort || !studentId) {
      setError("Please fill in all fields")
      return false
    }
    // Validate student ID format
    if (studentId.length < 6) {
      setError("Invalid student ID")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    const normalized = email.trim().toLowerCase()
    if (organization === "pku") {
      const expectedEmail = `${studentId.toLowerCase()}@stu.pku.edu.cn`
      if (normalized !== expectedEmail) {
        setError(`Email must be ${expectedEmail}`)
        return false
      }
      return true
    }

    const isThuFormat =
      normalized.startsWith(`${studentId.toLowerCase()}@`) &&
      (normalized.endsWith("@mails.tsinghua.edu.cn") || normalized.endsWith("@tsinghua.edu.cn"))

    if (!isThuFormat) {
      setError(`Email must match ${studentId}@mails.tsinghua.edu.cn`)
      return false
    }

    return true
  }

  const validateStep3 = () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleNext = () => {
    setError("")
    setInfo("")
    
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    if (step === 3 && !validateStep3()) return
    
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setError("")
    setInfo("")
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSendCode = async () => {
    setInfo(`Verification interface is reserved. For now, continue directly with ${email}.`)
  }

  const handleSubmit = async () => {
    if (!englishName || !username) {
      setError("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    setError("")
    setInfo("")

    try {
      // First sign up with our custom auth
      const signUpResult = await signUp({
        email,
        password,
        englishName,
        username,
        organization: organization as Organization,
        cohort: Number(cohort),
        studentId,
      })

      if (signUpResult === null || signUpResult === undefined) {
        setError("Registration failed")
        return
      }

      // Then sign in to get the session
      const signInResult = await signIn({
        email,
        password,
      })

      if (signInResult === null || signInResult === undefined || !signInResult.success) {
        setError("Registration successful but login failed. Please try logging in.")
        router.push("/login?registered=true")
        return
      }

      router.push("/login?registered=true")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addResearchInterest = () => {
    if (newInterest && !researchInterests.includes(newInterest)) {
      setResearchInterests([...researchInterests, newInterest])
      setNewInterest("")
    }
  }

  const removeResearchInterest = (interest: string) => {
    setResearchInterests(researchInterests.filter(i => i !== interest))
  }

  const addTitle = () => {
    if (!newTitle.trim() || !newLink.trim()) return
    setTitles((prev) => [...prev, { title: newTitle.trim(), link: newLink.trim() }])
    setNewTitle("")
    setNewLink("")
  }

  const removeTitle = (idx: number) => {
    setTitles((prev) => prev.filter((_, index) => index !== idx))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Create Account
          </CardTitle>
          <CardDescription>
            Step {step} of 4: {" "}
            {step === 1 && "Select Organization"}
            {step === 2 && "Verify Email"}
            {step === 3 && "Set Password"}
            {step === 4 && "Complete Profile"}
          </CardDescription>
          
          {/* Progress bar */}
          <div className="flex justify-center gap-1 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          {info && (
            <div className="p-3 text-sm text-blue-700 bg-blue-50 rounded-md">
              {info}
            </div>
          )}

          {/* Step 1: Organization Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <select
                  id="organization"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={organization}
                  onChange={(e) => {
                    setOrganization(e.target.value as Organization)
                    setCohort("")
                  }}
                  required
                >
                  <option value="">Select your organization</option>
                  {Object.entries(ORGANIZATIONS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cohort">Cohort / Year</Label>
                <select
                  id="cohort"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={cohort}
                  onChange={(e) => setCohort(Number(e.target.value))}
                  required
                  disabled={!organization}
                >
                  <option value="">Select your cohort</option>
                  {organization && ORGANIZATIONS[organization]?.cohorts.map((year) => (
                    <option key={year} value={year}>
                      {year}级
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your student ID from Peking University or Tsinghua University
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Email Verification */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={getExpectedEmailHint()}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use the school mailbox bound to your student ID and organization.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="Enter code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={!email}
                  >
                    Send Code
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Verification feature is placeholder - you can proceed without code
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 4: Profile Completion */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="englishName">English Name *</Label>
                <Input
                  id="englishName"
                  type="text"
                  placeholder="e.g., John Zhang"
                  value={englishName}
                  onChange={(e) => setEnglishName(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be displayed on your public profile
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Used for login, not displayed publicly
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="personalEmail">Personal Email (Optional)</Label>
                <Input
                  id="personalEmail"
                  type="email"
                  placeholder="your.personal@email.com"
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Research Interests (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add research interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addResearchInterest())}
                  />
                  <Button type="button" variant="outline" onClick={addResearchInterest}>
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
                          onClick={() => removeResearchInterest(interest)}
                          className="hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Title + Link (Optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                  <Input
                    type="text"
                    placeholder="Title (e.g., Google Scholar)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={addTitle}>
                    Add
                  </Button>
                </div>
                {titles.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {titles.map((item, idx) => (
                      <div key={`${item.title}-${idx}`} className="flex items-center gap-2 p-2 rounded border border-border">
                        <span className="text-sm font-medium">{item.title}</span>
                        <a
                          href={normalizeUrl(item.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline truncate"
                        >
                          {item.link}
                        </a>
                        <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={() => removeTitle(idx)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
          >
            Back
          </Button>
          
          {step < 4 ? (
            <Button type="button" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          )}
        </CardFooter>

        <CardFooter className="pt-0">
          <p className="text-sm text-center text-muted-foreground w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
