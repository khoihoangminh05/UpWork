import ManagementSection from '@/components/Management/ManagementSection'
import UserInfoSection from '@/components/PortfolioClient/ClientInfoSection'
import React from 'react'

const ManagementPage = () => {
  return (
   <div className="flex h-screen">
       <UserInfoSection />
       <ManagementSection />
    </div>
  )
}

export default ManagementPage