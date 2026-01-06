import ClientStatSection from '@/components/PortfolioClient/ClientStatSection'
import ClientInfoSection from '@/components/PortfolioClient/ClientInfoSection'
import React from 'react'
import { useAuth } from '@/context/AuthContext';
import WorkerInfoSection from '@/components/PortfolioWorker/WorkerInfoSection';
import WorkerStatSection from '@/components/PortfolioWorker/WorkerStatSection';

const PortfolioPage = () => {
  const {user} = useAuth();
   if(user.role === "client")
    return (
      <div className="flex h-screen">
        <ClientInfoSection />
        <ClientStatSection />
      </div>
    );

    return (
      <div className="flex h-screen">
        <WorkerInfoSection />
        <WorkerStatSection />
      </div>
    );
}

export default PortfolioPage