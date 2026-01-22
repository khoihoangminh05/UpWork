import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Zap, RefreshCw } from 'lucide-react';
import api from '@/config/axios';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const JobAssignmentDashboard = () => {
    const [stats, setStats] = useState({ workers: 0, jobs: 0 });
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [lastResult, setLastResult] = useState(null);

    // Hàm lấy số liệu thống kê
    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.get('/auto-assign/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Hàm chạy thuật toán ghép cặp
    const handleAutoAssign = async () => {
        setProcessing(true);
        try {
            const res = await api.post('/auto-assign/run');
            
            if (res.data.matches_found > 0) {
                toast.success(`Thành công! Đã ghép được ${res.data.matches_found} cặp.`);
                setLastResult(res.data.details); // Lưu kết quả để hiển thị list bên dưới
            } else {
                toast.info("Không tìm thấy cặp nào phù hợp lúc này.");
            }

            // Load lại số liệu mới sau khi ghép xong
            fetchStats();
        } catch (err) {
            toast.error("Lỗi hệ thống khi chạy thuật toán.");
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Điều phối công việc</h2>
                    <p className="text-muted-foreground">Quản lý và phân phối việc làm tự động cho thợ.</p>
                </div>
                <Button variant="outline" size="icon" onClick={fetchStats} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* KHU VỰC THỐNG KÊ (STATS CARDS) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thợ đang rảnh</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.workers}</div>
                        <p className="text-xs text-muted-foreground">Sẵn sàng nhận việc ngay</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Việc chưa nhận</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.jobs}</div>
                        <p className="text-xs text-muted-foreground">Đang chờ thợ (Status: Open)</p>
                    </CardContent>
                </Card>

                {/* CARD HÀNH ĐỘNG */}
                <Card className="border-purple-200 bg-purple-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-900">Hệ thống ghép cặp</CardTitle>
                        <Zap className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <Button 
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={handleAutoAssign}
                            disabled={processing || stats.workers === 0 || stats.jobs === 0}
                        >
                            {processing ? "Đang xử lý..." : "⚡ Chạy Phân Phối Ngay"}
                        </Button>
                        <p className="text-xs text-purple-600/80 mt-2 text-center">
                            Thuật toán Hungarian sẽ chạy để tối ưu khoảng cách.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* KẾT QUẢ VỪA CHẠY (Nếu có) */}
            {lastResult && lastResult.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Kết quả ghép cặp vừa chạy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-600 font-medium border-b">
                                    <tr>
                                        <th className="px-4 py-3">Tên Thợ</th>
                                        <th className="px-4 py-3">Công Việc</th>
                                        <th className="px-4 py-3">Khoảng cách</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {lastResult.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{item.worker}</td>
                                            <td className="px-4 py-3">{item.job}</td>
                                            <td className="px-4 py-3 text-green-600">{item.distance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default JobAssignmentDashboard;