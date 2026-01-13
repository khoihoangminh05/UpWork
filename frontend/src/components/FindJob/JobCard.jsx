import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ConfirmDialog } from '../ConfirmDialog';
import { toast } from 'sonner';
import api from '@/config/axios';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '../ui/separator';
import timeAgo from '@/lib/time';

import { 
  MapPin, 
  Calendar, 
  Clock, 
  Wallet, 
  Phone, 
  User, 
  ChevronDown, 
  ChevronUp,
  Briefcase
} from 'lucide-react';

const JobCard = ({ job, handleJobChange }) => {
  const [isFull, setIsFull] = useState(false);
  const { user } = useAuth();

  const handleAcceptJob = async () => {
     if(user.role !== 'worker') {
        toast.info("Chỉ tài khoản Thợ mới được nhận việc!");
        return;
     }
     try {
        await api.put(`jobs/${job._id}/accept`);
        toast.success("🎉 Nhận việc thành công! Hãy liên hệ khách hàng ngay.");
        handleJobChange();
     }
     catch(e) {
      console.log(e);

      toast.error(e.response?.data?.msg || "Nhận việc thất bại, vui lòng thử lại.");
     }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-l-purple-500 bg-white">
        <div className="p-5 flex flex-col gap-4">
           

           <div className="flex justify-between items-start gap-4">
             <div className="flex items-start gap-3 flex-1">

                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {job.category?.image ? (
                        <img src={job.category.image} alt={job.category.name} className="w-full h-full object-cover" />
                    ) : (
                        <Briefcase className="w-6 h-6 text-purple-500" />
                    )}
                </div>

                <div>
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-purple-700 transition-colors">
                        {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                            {job.category?.name || "Dịch vụ"}
                        </Badge>
                        <span className="text-xs text-gray-400">• {timeAgo(job.createdAt)}</span>
                    </div>
                </div>
             </div>

             <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-emerald-600">
                    {formatCurrency(job.price)}
                </div>
                <div className="text-xs text-gray-400 capitalize">
                    {job.paymentType || "VND"}
                </div>
             </div>
           </div>

           <Separator className="bg-gray-100" /> 
           

           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">

                <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1" title={job.address}>{job.address}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>{job.phone?.slice(0, 4)}***{job.phone?.slice(-3)}</span>
                </div>


                {job.startDate && (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>Ngày: {formatDate(job.startDate)}</span>
                    </div>
                )}

                {(job.startTime || job.endTime) && (
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>Giờ: {job.startTime || "..."} - {job.endTime || "..."}</span>
                    </div>
                )}
           </div>

           {job.client && (
               <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded-lg w-fit">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {job.client.avatar ? (
                          <img src={job.client.avatar} alt="Client" />
                      ) : (
                          <User className="w-4 h-4 text-gray-500" />
                      )}
                  </div>
                  <span className="text-xs text-gray-500">Đăng bởi: <span className="font-medium text-gray-700">{job.client.fullName || "Khách hàng"}</span></span>
               </div>
           )}
 
           {isFull && (
            <div className="mt-2 p-4 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">Chi tiết công việc:</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                    {job.description || "Không có mô tả chi tiết."}
                </p>

                <div className="mt-6 flex items-center gap-3">
                    <ConfirmDialog
                        trigger={
                            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md">
                                <Wallet className="w-4 h-4 mr-2" /> 
                                Nhận việc ngay (-50k)
                            </Button>
                        }
                        title="Xác nhận nhận việc"
                        description="Bạn sẽ bị trừ 50.000 VNĐ vào ví để nhận thông tin liên hệ đầy đủ của khách hàng này. Bạn có chắc chắn không?"
                        confirmText="Xác nhận trừ tiền"
                        cancelText="Hủy bỏ"
                        onConfirm={handleAcceptJob}
                    />
                </div>
            </div>
           )}

           <div className="flex justify-center mt-1">
                <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs text-gray-400 hover:text-purple-600 hover:bg-purple-50 h-8 gap-1 w-full"
                    onClick={() => setIsFull(!isFull)}
                >
                    {isFull ? (
                        <>Thu gọn <ChevronUp className="w-3 h-3" /></>
                    ) : (
                        <>Xem chi tiết & Nhận việc <ChevronDown className="w-3 h-3" /></>
                    )}
                </Button>
           </div>
           
        </div>
    </Card>
  )
}

export default JobCard