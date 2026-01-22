import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/button';
import { DepositDialog } from './DepositDialog';
import multiavatar from '@multiavatar/multiavatar/esm';
import api from '@/config/axios';
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Clock, CalendarDays } from 'lucide-react';

const WorkerInfoSection = () => {
    const { user, setUser } = useAuth();
    
    // --- STATE CHO AVATAR ---
    const svg = multiavatar(user.avatarSeed || "example");
    const encoded = btoa(unescape(encodeURIComponent(svg)));

    // --- STATE CHO LỊCH RẢNH ---
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // Mặc định chọn giờ hành chính
    const [startTime, setStartTime] = useState("08:00"); 
    const [endTime, setEndTime] = useState("17:00");
    // Mảng lưu các ngày được chọn (0: CN, 1: T2, ...)
    const [selectedDays, setSelectedDays] = useState([]);

    // Map ngày ra tiếng Việt
    const daysOfWeek = [
        { id: 1, label: "Thứ 2" },
        { id: 2, label: "Thứ 3" },
        { id: 3, label: "Thứ 4" },
        { id: 4, label: "Thứ 5" },
        { id: 5, label: "Thứ 6" },
        { id: 6, label: "Thứ 7" },
        { id: 0, label: "Chủ Nhật" },
    ];

    // Load dữ liệu lịch rảnh từ user hiện tại khi mở component
    useEffect(() => {
        if (user.availability && user.availability.length > 0) {
            // Lấy danh sách ngày đã lưu
            const savedDays = user.availability.map(a => a.dayOfWeek);
            setSelectedDays(savedDays);
            // Lấy khung giờ của ngày đầu tiên tìm thấy (để hiển thị mặc định)
            setStartTime(user.availability[0].startTime);
            setEndTime(user.availability[0].endTime);
        }
    }, [user]);

    // 1. HÀM ĐỔI AVATAR
    const changeAvatar = async () => {
        try {
            let seed = Math.random().toString(36).substring(2, 10);
            await api.put('/auth/avatar', { seed });
            toast.success("Đổi ảnh thành công!");
            setUser({ ...user, avatarSeed: seed });
        } catch (err) {
            console.log(err);
            toast.error("Đổi ảnh thất bại!");
        }
    }

    // 2. HÀM BẬT/TẮT TỰ ĐỘNG NHẬN VIỆC
    const toggleAutoAssign = async (checked) => {
        const newStatus = checked ? 'available' : 'busy';
        try {
            // Gọi API cập nhật status (bạn cần đảm bảo backend hỗ trợ route này hoặc dùng route update profile chung)
            // Giả sử dùng chung route update profile
            await api.put('/worker/profile', {
                skills: user.skills || [],
                availability: user.availability || [],
                currentStatus: newStatus
            });
            
            setUser({ ...user, currentStatus: newStatus });
            if(checked) toast.success("Đã BẬT chế độ nhận việc tự động!");
            else toast.info("Đã TẮT chế độ nhận việc tự động.");

        } catch (err) {
            console.error(err);
            toast.error("Lỗi cập nhật trạng thái!");
        }
    };

    // 3. HÀM LƯU LỊCH RẢNH
    const handleSaveSchedule = async () => {
        try {
            // Tạo mảng availability theo format backend yêu cầu
            const newAvailability = selectedDays.map(day => ({
                dayOfWeek: day,
                startTime: startTime,
                endTime: endTime
            }));

            // Gọi API
            await api.put('/worker/profile', {
                skills: user.skills || [], // Giữ nguyên skill cũ
                availability: newAvailability,
                currentStatus: user.currentStatus // Giữ nguyên status
            });

            // Cập nhật Context
            setUser({ ...user, availability: newAvailability });
            
            toast.success("Đã cập nhật lịch làm việc!");
            setIsDialogOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi lưu lịch!");
        }
    }

    // Helper toggle chọn ngày
    const toggleDay = (dayId) => {
        setSelectedDays(prev => 
            prev.includes(dayId) 
                ? prev.filter(d => d !== dayId) 
                : [...prev, dayId]
        );
    }

    return (
        <div className="w-1/4 m-2 flex flex-col gap-4">
            
            {/* --- CARD 1: THÔNG TIN CÁ NHÂN --- */}
            <Card className="pb-5">
                <h3 className="text-lg font-semibold py-3 pl-3">Thông tin cá nhân</h3>
                <Separator className="bg-gray-200" />
                <div className="w-full flex items-center justify-center h-40">
                    <div className="flex flex-col items-center">
                        <img src={`data:image/svg+xml;base64,${encoded}`} className="size-20 rounded-full border-2 border-gray-100 shadow-sm" />
                        <Button
                            variant="ghost"
                            className="h-8 mt-2 text-xs text-blue-600 hover:text-blue-800"
                            onClick={changeAvatar}
                        >
                            Đổi Avatar ngẫu nhiên
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-3 pl-3 text-sm">
                    <p><span className="font-medium text-gray-500">Họ tên:</span> {user.fullName}</p>
                    <p><span className="font-medium text-gray-500">Vai trò:</span> {user.role === "admin" ? "Quản trị viên" : user.role === "worker" ? "Thợ / Đối tác" : "Khách hàng"} </p>
                    <p><span className="font-medium text-gray-500">Liên hệ:</span> {user.phone || "Chưa cập nhật"}</p>
                </div>
            </Card>

            {/* --- CARD 2: CẤU HÌNH NHẬN VIỆC (MỚI) --- */}
            {user.role === 'worker' && (
                <Card className="pb-5 border-blue-200 bg-blue-50/30">
                    <h3 className="text-lg font-semibold py-3 pl-3 flex items-center gap-2">
                        <ZapIcon className="size-5 text-yellow-500"/> Cấu hình việc làm
                    </h3>
                    <Separator className="bg-blue-100 mb-4" />

                    <div className="px-4 space-y-4">
                        {/* Toggle Tự động nhận việc */}
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="auto-mode" className="flex flex-col">
                                <span className="font-medium">Nhận việc tự động</span>
                                <span className="text-xs text-gray-500">Hệ thống tự ghép việc phù hợp</span>
                            </Label>
                            <Switch 
                                id="auto-mode" 
                                checked={user.currentStatus === 'available'}
                                onCheckedChange={toggleAutoAssign}
                            />
                        </div>

                        {/* Nút Cài đặt lịch rảnh */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                                    <CalendarDays className="mr-2 h-4 w-4" /> Cài đặt lịch rảnh
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Cập nhật thời gian rảnh</DialogTitle>
                                </DialogHeader>
                                
                                <div className="grid gap-4 py-4">
                                    {/* Chọn giờ */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Label>Giờ bắt đầu</Label>
                                            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                        </div>
                                        <div className="flex-1">
                                            <Label>Giờ kết thúc</Label>
                                            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                        </div>
                                    </div>

                                    {/* Chọn ngày */}
                                    <Label className="mt-2">Ngày trong tuần</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {daysOfWeek.map((day) => (
                                            <div key={day.id} className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id={`day-${day.id}`} 
                                                    checked={selectedDays.includes(day.id)}
                                                    onCheckedChange={() => toggleDay(day.id)}
                                                />
                                                <label
                                                    htmlFor={`day-${day.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {day.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <DialogFooter>
                                    <Button type="submit" onClick={handleSaveSchedule}>Lưu thay đổi</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        
                        {/* Hiển thị tóm tắt lịch */}
                        <div className="text-xs text-gray-500 bg-white p-2 rounded border border-gray-100">
                             {user.availability && user.availability.length > 0 ? (
                                 <p>Đang rảnh {user.availability.length} ngày/tuần ({startTime} - {endTime})</p>
                             ) : (
                                 <p className="text-red-400">Chưa thiết lập lịch rảnh!</p>
                             )}
                        </div>

                    </div>
                </Card>
            )}

            {/* --- CARD 3: THỐNG KÊ --- */}
            <Card>
                <h3 className="text-lg font-semibold py-3 pl-3">Thống kê hoạt động</h3>
                <Separator className="bg-gray-200" />
                <div className="flex flex-col gap-3 pl-3 my-3 text-sm">
                    <p><span className="font-medium text-gray-500">Số dư ví:</span> <span className="text-green-600 font-bold">{user.walletBalance?.toLocaleString()} đ</span></p>
                    <p><span className="font-medium text-gray-500">Đánh giá:</span> {user.workerStats?.averageRating || 0} / 5 ⭐</p>
                    <p><span className="font-medium text-gray-500">Số lượt nhận xét:</span> {user.workerStats?.totalReviews || 0}</p>
                </div>
            </Card>

            <DepositDialog
                trigger={<Button className="w-full bg-green-600 hover:bg-green-700 shadow-md">Nạp tiền vào ví</Button>}
            />

        </div>
    )
}

// Icon tia sét trang trí
const ZapIcon = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
)

export default WorkerInfoSection