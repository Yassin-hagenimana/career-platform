"use client"

import { useState } from "react"
import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardNav from "@/components/dashboard-nav"

export default function DashboardSettingsPage() {
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100")

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardNav activeItem="settings" />

      <div className="flex-1">
        <div className="container py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information and how others see you on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileImage} alt="Profile" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    </div>
                    <div className="grid gap-4 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="headline">Professional Headline</Label>
                        <Input id="headline" defaultValue="Software Developer & Entrepreneur" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue="Nairobi, Kenya" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          defaultValue="Passionate software developer with 5 years of experience building web and mobile applications. Interested in entrepreneurship and technology for social impact."
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Skills & Expertise</h3>
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills (separated by commas)</Label>
                      <Input id="skills" defaultValue="JavaScript, React, Node.js, UI/UX Design, Project Management" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Social Profiles</h3>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input id="linkedin" defaultValue="https://linkedin.com/in/johndoe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter</Label>
                          <Input id="twitter" defaultValue="https://twitter.com/johndoe" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub</Label>
                          <Input id="github" defaultValue="https://github.com/johndoe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Personal Website</Label>
                          <Input id="website" defaultValue="https://johndoe.com" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account details and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex gap-2">
                          <Input id="email" defaultValue="john.doe@example.com" />
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Change Email
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex gap-2">
                          <Input id="phone" defaultValue="+254 712 345 678" />
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Verify
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                      </div>
                      <Button className="w-fit">Update Password</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Language & Region</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="sw">Swahili</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="africa-nairobi">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="africa-nairobi">East Africa Time (UTC+3)</SelectItem>
                            <SelectItem value="africa-lagos">West Africa Time (UTC+1)</SelectItem>
                            <SelectItem value="africa-cairo">Eastern European Time (UTC+2)</SelectItem>
                            <SelectItem value="africa-johannesburg">South Africa Standard Time (UTC+2)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                    <div className="grid gap-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                        <div>
                          <h4 className="font-medium">Deactivate Account</h4>
                          <p className="text-sm text-muted-foreground">
                            Temporarily disable your account. You can reactivate anytime.
                          </p>
                        </div>
                        <Button variant="outline" className="border-destructive text-destructive">
                          Deactivate
                        </Button>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                        <div>
                          <h4 className="font-medium">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all your data. This action cannot be undone.
                          </p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-courses">Course Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about new lessons and course updates
                          </p>
                        </div>
                        <Switch id="email-courses" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-workshops">Workshop Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive reminders about upcoming workshops you've registered for
                          </p>
                        </div>
                        <Switch id="email-workshops" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-community">Community Activity</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about replies to your discussions
                          </p>
                        </div>
                        <Switch id="email-community" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-jobs">Job Opportunities</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about new job opportunities matching your profile
                          </p>
                        </div>
                        <Switch id="email-jobs" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-funding">Funding Opportunities</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about new funding opportunities
                          </p>
                        </div>
                        <Switch id="email-funding" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-marketing">Marketing & Promotions</Label>
                          <p className="text-sm text-muted-foreground">Receive marketing emails and special offers</p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Push Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-messages">Messages</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications for new messages</p>
                        </div>
                        <Switch id="push-messages" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-community">Community Mentions</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications when you're mentioned in discussions
                          </p>
                        </div>
                        <Switch id="push-community" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-applications">Application Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications for updates on your job or funding applications
                          </p>
                        </div>
                        <Switch id="push-applications" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Frequency</h3>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Email Digest Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Digest</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Manage your privacy and security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile Visibility</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="visibility-profile">Public Profile</Label>
                          <p className="text-sm text-muted-foreground">
                            Make your profile visible to everyone on the platform
                          </p>
                        </div>
                        <Switch id="visibility-profile" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="visibility-email">Show Email Address</Label>
                          <p className="text-sm text-muted-foreground">
                            Display your email address on your public profile
                          </p>
                        </div>
                        <Switch id="visibility-email" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="visibility-phone">Show Phone Number</Label>
                          <p className="text-sm text-muted-foreground">
                            Display your phone number on your public profile
                          </p>
                        </div>
                        <Switch id="visibility-phone" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="visibility-activity">Activity Status</Label>
                          <p className="text-sm text-muted-foreground">Show when you're active on the platform</p>
                        </div>
                        <Switch id="visibility-activity" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="security-2fa">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="security-2fa" />
                          <Button variant="outline" size="sm" disabled>
                            Setup
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="security-sessions">Active Sessions</Label>
                          <p className="text-sm text-muted-foreground">
                            Manage devices where you're currently logged in
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data & Privacy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="data-personalization">Personalized Content</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow us to personalize your experience based on your activity
                          </p>
                        </div>
                        <Switch id="data-personalization" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="data-cookies">Cookies</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow us to use cookies to improve your experience
                          </p>
                        </div>
                        <Switch id="data-cookies" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="data-analytics">Analytics</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow us to collect anonymous usage data to improve our services
                          </p>
                        </div>
                        <Switch id="data-analytics" defaultChecked />
                      </div>
                      <div className="pt-2">
                        <Button variant="outline">Download My Data</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Payments</CardTitle>
                  <CardDescription>Manage your payment methods and billing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Current Plan</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h4 className="font-medium">Free Plan</h4>
                          <p className="text-sm text-muted-foreground">
                            Basic access to courses and community features
                          </p>
                        </div>
                        <Button>Upgrade to Pro</Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payment Methods</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted p-2 rounded-md">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">No payment methods added</p>
                            <p className="text-sm text-muted-foreground">Add a payment method to upgrade your plan</p>
                          </div>
                        </div>
                        <Button variant="outline">Add Payment Method</Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Billing Information</h3>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billing-name">Full Name</Label>
                          <Input id="billing-name" placeholder="Enter your full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing-email">Email Address</Label>
                          <Input id="billing-email" placeholder="Enter your email address" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billing-address">Address</Label>
                        <Input id="billing-address" placeholder="Enter your address" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billing-city">City</Label>
                          <Input id="billing-city" placeholder="Enter your city" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing-state">State/Province</Label>
                          <Input id="billing-state" placeholder="Enter your state/province" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing-zip">Postal Code</Label>
                          <Input id="billing-zip" placeholder="Enter your postal code" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billing-country">Country</Label>
                        <Select>
                          <SelectTrigger id="billing-country">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ke">Kenya</SelectItem>
                            <SelectItem value="ng">Nigeria</SelectItem>
                            <SelectItem value="za">South Africa</SelectItem>
                            <SelectItem value="gh">Ghana</SelectItem>
                            <SelectItem value="eg">Egypt</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Billing History</h3>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <p className="text-muted-foreground">No billing history available</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

