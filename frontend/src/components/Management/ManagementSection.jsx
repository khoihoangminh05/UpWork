import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUserTable from './AdminUserTable'; // Component bảng user cũ của bạn
import JobAssignmentDashboard from './JobAssignmentDashboard'; // Component mới vừa tạo

const ManagementSection = () => {
    return (
        <div className="flex-1 p-8 overflow-y-auto h-screen bg-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500">Xin chào, chúc bạn một ngày làm việc hiệu quả.</p>
            </div>

            {/* HỆ THỐNG TABS */}
            <Tabs defaultValue="users" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="users">Quản lý Người dùng</TabsTrigger>
                    <TabsTrigger value="jobs">Phân phối Việc làm</TabsTrigger>
                </TabsList>

                {/* TAB 1: USER (Cũ) */}
                <TabsContent value="users" className="space-y-4">
                    <AdminUserTable />
                </TabsContent>

                {/* TAB 2: JOB (Mới) */}
                <TabsContent value="jobs" className="space-y-4">
                    <JobAssignmentDashboard />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ManagementSection;