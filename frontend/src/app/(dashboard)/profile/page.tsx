"use client";

import React, { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Mail, Lock, Upload, Shield, Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  // User profile state
  const [profile, setProfile] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@enterprise.ai',
    jobTitle: 'System Administrator'
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('user_name');
      const email = localStorage.getItem('user_email');
      if (name) {
        const parts = name.trim().split(' ');
        const first = parts[0] || 'Admin';
        const last = parts.slice(1).join(' ') || 'User';
        setProfile(prev => ({ ...prev, firstName: first, lastName: last }));
      }
      if (email) {
        setProfile(prev => ({ ...prev, email }));
      }
    }
  }, []);

  // Profile Photo state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password states
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    marketing: false,
    security: true,
    reports: true
  });

  // 2FA state
  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleSave = (section: string) => {
    setIsLoading(section);
    setTimeout(() => {
      if (section === 'Personal information' && typeof window !== 'undefined') {
        localStorage.setItem('user_name', `${profile.firstName} ${profile.lastName}`.trim());
        localStorage.setItem('user_email', profile.email);
      }
      setIsLoading(null);
      toast.success(`${section} settings updated successfully.`);
    }, 800);
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    
    setIsLoading('Password');
    setTimeout(() => {
      setIsLoading(null);
      setPasswords({ current: '', new: '', confirm: '' });
      toast.success("Password changed successfully.");
    }, 800);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast.success("Profile photo updated!");
    }
  };

  const handleEnable2FA = () => {
    if (twoFactorCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }
    setIsLoading('2FA');
    setTimeout(() => {
      setIsLoading(null);
      setIs2FAOpen(false);
      setTwoFactorCode('');
      toast.success("Two-factor authentication enabled successfully!");
    }, 800);
  };

  const handleToggle = (setting: keyof typeof notifications, label: string) => {
    setNotifications(prev => {
      const newValue = !prev[setting];
      if (newValue) {
        toast.success(`${label} enabled.`);
      } else {
        toast.info(`${label} disabled.`);
      }
      return { ...prev, [setting]: newValue };
    });
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings, security, and notification preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full mt-2">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Update your avatar to personalize your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="relative h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="object-cover h-full w-full" />
                ) : (
                  <User className="h-10 w-10 text-slate-400" />
                )}
              </div>
              <div className="space-y-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 256x256px. Max file size: 5MB.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={profile.firstName} 
                    onChange={e => setProfile({...profile, firstName: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={profile.lastName} 
                    onChange={e => setProfile({...profile, lastName: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile.email} 
                      onChange={e => setProfile({...profile, email: e.target.value})} 
                      className="pl-9" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input 
                    id="jobTitle" 
                    value={profile.jobTitle} 
                    onChange={e => setProfile({...profile, jobTitle: e.target.value})} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button 
                onClick={() => handleSave('Personal information')}
                disabled={isLoading === 'Personal information'}
              >
                {isLoading === 'Personal information' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account is using a long, random password to stay secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-md">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    className="pl-9" 
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2 max-w-md">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="newPassword" 
                    type="password" 
                    className="pl-9"
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2 max-w-md">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    className="pl-9"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button 
                onClick={handlePasswordChange}
                disabled={isLoading === 'Password'}
              >
                {isLoading === 'Password' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-indigo-500" />
                  Authenticator App
                </p>
                <p className="text-sm text-muted-foreground">
                  Use an app like Google Authenticator or 1Password to generate codes.
                </p>
              </div>
              <Dialog open={is2FAOpen} onOpenChange={setIs2FAOpen}>
                <DialogTrigger render={<Button variant="outline" />}>
                  Enable 2FA
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                      Scan the QR code below with your authenticator app to set up 2FA.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <div className="h-48 w-48 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-dashed border-slate-300">
                      <QrCode className="h-24 w-24 text-slate-400" />
                    </div>
                    <p className="text-sm text-center text-muted-foreground font-mono bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded">
                      A3F9 Q7XT 9L2B R5V1
                    </p>
                  </div>
                  <div className="space-y-3 border-t pt-4">
                    <Label htmlFor="code" className="text-sm font-medium">
                      Verification Code
                    </Label>
                    <Input 
                      id="code" 
                      placeholder="123456" 
                      maxLength={6} 
                      className="text-center tracking-widest text-lg font-mono h-12"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <DialogFooter className="sm:justify-between pt-4 mt-2 border-t">
                    <Button variant="ghost" onClick={() => setIs2FAOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleEnable2FA}
                      disabled={isLoading === '2FA'}
                    >
                      {isLoading === '2FA' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verify & Enable
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what updates you want to receive via email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing" className="text-base cursor-pointer">Marketing emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new products, features, and more.
                  </p>
                </div>
                <Switch 
                  id="marketing" 
                  checked={notifications.marketing}
                  onCheckedChange={() => handleToggle('marketing', 'Marketing emails')}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 opacity-60">
                <div className="space-y-0.5">
                  <Label htmlFor="security" className="text-base cursor-not-allowed">Security emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about your account activity and security.
                  </p>
                </div>
                <Switch id="security" checked disabled />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="reports" className="text-base cursor-pointer">Weekly reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly digest of your analytics.
                  </p>
                </div>
                <Switch 
                  id="reports" 
                  checked={notifications.reports}
                  onCheckedChange={() => handleToggle('reports', 'Weekly reports')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


    </div>
  );
}
