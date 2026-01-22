import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
  MapPin,
  Phone,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  ImagePlus, 
  Calendar
} from 'lucide-react';
import timeAgo from '@/lib/time';

const JobCard = ({ job }) => {
  const [isFull, setIsFull] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderStatus = () => {
    if (job.status === 'Completed') {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1">
          <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 gap-1 animate-pulse">
        <Clock className="w-3 h-3" /> Đang thực hiện
      </Badge>
    );
  };

  const handleSendMedia = () => {
    console.log("Open media upload modal for job:", job._id);
  
  };

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 ${job.status === 'Completed' ? 'border-l-green-500 opacity-90' : 'border-l-blue-500 bg-white'}`}>

      <div className="p-5 flex flex-col gap-4">

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            
             {job.category?.image ? (
                 <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                    {job.category.image} 
                 </div>
             ) : (
                 <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl">🛠️</div>
             )}

            <div>
              <h3 className="font-bold text-gray-800 line-clamp-1 text-lg">{job.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                 <Badge variant="outline" className="text-xs font-normal text-gray-500">
                    {job.category?.name}
                 </Badge>
                 <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {timeAgo(job.createdAt)}
                 </span>
              </div>
            </div>
          </div>

          <div className="text-right">
             <div className="text-lg font-bold text-emerald-600">
                {formatCurrency(job.price)}
             </div>
             <div className="text-xs text-gray-400 capitalize">{job.paymentType}</div>
          </div>
        </div>

        <Separator className="bg-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
 
           <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700">
                 <User className="w-4 h-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                 <p className="text-xs text-purple-500 font-semibold uppercase">Khách hàng</p>
                 <p className="font-bold text-gray-800 truncate">{job.client?.fullName || "Ẩn danh"}</p>
              </div>

              <a href={`tel:${job.phone}`} className="p-2 bg-white rounded-full text-green-600 shadow-sm hover:scale-110 transition-transform">
                 <Phone className="w-4 h-4" />
              </a>
           </div>

           <div className="flex flex-col justify-center gap-2 px-2">
              <div className="flex items-start gap-2 text-gray-600">
                 <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                 <span className="line-clamp-2 leading-tight">{job.address}</span>
              </div>
              {(job.startDate || job.startTime) && (
                 <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span>{formatDate(job.startDate)} {job.startTime ? `(${job.startTime} - ${job.endTime})` : ''}</span>
                 </div>
              )}
           </div>
        </div>

        <div className="flex items-center justify-between">
            {renderStatus()}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFull(!isFull)}
                className="text-gray-400 hover:text-purple-600 h-8 text-xs"
            >
                {isFull ? "Thu gọn" : "Xem chi tiết"}
                {isFull ? <ChevronUp className="w-3 h-3 ml-1"/> : <ChevronDown className="w-3 h-3 ml-1"/>}
            </Button>
        </div>

        {isFull && (
            <div className="mt-2 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Mô tả công việc</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {job.description || "Không có mô tả chi tiết."}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        variant="outline"
                        className="w-full border-dashed border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-600 hover:text-purple-700 transition-colors"
                        onClick={handleSendMedia}
                    >
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Gửi ảnh/video báo cáo công việc
                    </Button>

                    {job.status !== 'Completed' && (
                        <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Lưu ý cho thợ:</p>
                                <p className="text-blue-600/80 text-xs mt-1">
                                    Khi hoàn thành công việc, hãy nhắc Khách hàng vào ứng dụng để bấm <b>"Xác nhận hoàn thành"</b> và đánh giá cho bạn. Tiền sẽ được cộng vào ví sau khi khách xác nhận.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {job.status === 'Completed' && job.review && (
                    <div className="mt-3">
                         <p className="text-xs font-bold text-gray-500 uppercase mb-2">Đánh giá từ khách hàng</p>
                         <div className="flex items-center gap-1 text-yellow-500 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < job.review.rating ? "fill-current" : "text-gray-300"}>★</span>
                            ))}
                         </div>
                         <p className="text-sm italic text-gray-600">"{job.review.comment}"</p>
                    </div>
                )}
            </div>
        )}

      </div>
    </Card>
  )
}

export default JobCard;