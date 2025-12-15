"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userProfileAPI } from "@/api/userApi";
import basePath from 'next/config';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  password?: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log(localStorage.getItem("token"));
    const token = localStorage.getItem("token");
    if (!token) {
      window.alert("未登录，请先登录！");
      router.replace(`/login`);
      return;
    }
    // 页面加载时自动获取用户信息
    const fetchProfile = async () => {
      try {
        const res = await userProfileAPI(token);
        if (res.code === 200 && res.data) {
          setProfile(res.data);
        } else if (res.code === 401) {
          window.alert("无效的登录状态，请重新登录！");
          router.replace(`/login`);
        } else {
          setProfile(null);
        }
      } catch {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [router]);

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-slate-900 rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-6">个人资料</h2>
      {profile ? (
        <div className="space-y-4">
          <div>
            <span className="font-semibold">用户名：</span>
            <span>{profile.username}</span>
          </div>
          <div>
            <span className="font-semibold">邮箱：</span>
            <span>{profile.email}</span>
          </div>
          <div>
            <span className="font-semibold">用户ID：</span>
            <span>{profile.id}</span>
          </div>
        </div>
      ) : (
        <div>未登录或获取信息失败</div>
      )}
    </div>
  );
}