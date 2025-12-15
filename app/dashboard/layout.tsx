"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      console.log("No token found, redirecting to login")
      router.replace(`/login`);
    }
  }, [router])

  return <DashboardLayout>{children}</DashboardLayout>
}
