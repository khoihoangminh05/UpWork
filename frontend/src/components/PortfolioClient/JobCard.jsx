import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { ConfirmDialog } from '../ConfirmDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import api from '@/config/axios';
import { toast } from 'sonner';
import timeAgo from '@/lib/time';

// --- ICONS ---
import { 
  Star, 
  Loader2, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Save,
  X
} from 'lucide-react';

const JobCard = ({ job, handleJobChange }) => {
  const [isFull, setIsFull] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [newDescription, setNewDescription] = useState(job.description);
  
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ... (Giữ nguyên các hàm xử lý API: updateJob, deleteJob, handleCompleteJob)
  const updateJob = async () => {
    try {
      await api.put("/jobs/" + job._id, { description: newDescription });
      toast.success("Đã cập nhật nội dung công việc");
      handleJobChange();
      setIsEditing(false);
    } catch (e) { console.error(e); toast.error("Cập nhật thất bại!"); }
  }

  const deleteJob = async () => {
    try {
      await api.delete("/jobs/" + job._id);
      toast.success("Đã xóa công việc");
      handleJobChange();
    } catch (e) { console.error(e); toast.error("Xóa thất bại!"); }
  }

  const handleCompleteJob = async () => {
    if (rating === 0) { toast.warning("Vui lòng chọn số sao!"); return; }
    setIsSubmitting(true);
    try {
      await api.put(`/jobs/${job._id}/complete`, { rating: rating, comment: reviewText });
      toast.success("Đã hoàn thành!");
      setIsReviewOpen(false); 
      handleJobChange(); 
    } catch (e) { console.error(e); toast.error("Lỗi khi hoàn thành!"); } 
    finally { setIsSubmitting(false); }
  }

  const renderStatusBadge = (status) => {
    switch(status) {
        case 'Open': return <Badge className="bg-green-100 text-green-700 border-green-200">Đang tìm thợ</Badge>;
        case 'In progress': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Đang thực hiện</Badge>;
        case 'Completed': return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Đã hoàn thành</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    // --- THAY ĐỔI 1: CSS CỦA CARD ---
    // 1. Dùng '!overflow-visible' để ép thẻ Card không được cắt nội dung con.
    // 2. Bỏ các class 'transform', 'scale', 'translate' để không tạo hệ toạ độ riêng.
    // 3. Dùng 'relative z-0' để làm nền tảng.
    <Card className="relative z-0 bg-white border border-gray-100 shadow-sm mb-4 !overflow-visible">
        
        {/* Header Content */}
        <div className="p-5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-xl border border-purple-100 shrink-0">
                        {job.category.image }
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{job.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                             <Clock className="w-3 h-3" /> {timeAgo(job.createdAt)}
                        </div>
                    </div>
                </div>
                {renderStatusBadge(job.status)}
            </div>

            <Separator className="bg-gray-100" />

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="truncate" title={job.address}>{job.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-bold text-emerald-600 text-base">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(job.price)}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 capitalize">{job.paymentType}</span>
                </div>
            </div>

            {/* Worker Info */}
            {job.worker && (
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
                             {job.worker.fullName ? job.worker.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                         </div>
                         <div className="overflow-hidden">
                             <p className="text-xs text-blue-500 font-semibold uppercase">Người thực hiện</p>
                             <p className="text-sm font-bold text-gray-800 truncate">{job.worker.fullName}</p>
                         </div>
                    </div>
                </div>
            )}

            {/* Expanded Content */}
            {isFull && (
                <div className="mt-2">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Mô tả</Label>
                        {!isEditing ? (
                            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 leading-relaxed border border-gray-100 whitespace-pre-line">
                                {job.description || "Không có mô tả chi tiết."}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Textarea 
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    className="min-h-[100px] bg-white"
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Hủy</Button>
                                    <Button size="sm" onClick={updateJob} className="bg-green-600 text-white">Lưu</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-gray-100 relative">
                        {/* CASE: OPEN */}
                        {job.status === 'Open' && !isEditing && (
                            <>
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                    <Edit className="w-4 h-4 mr-2" /> Sửa
                                </Button>
                                <ConfirmDialog
                                    trigger={<Button variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-2" /> Xóa</Button>}
                                    title="Xóa công việc?"
                                    description="Hành động này không thể hoàn tác."
                                    confirmText="Xóa ngay"
                                    onConfirm={deleteJob}
                                />
                            </>
                        )}

                        {/* CASE: IN PROGRESS -> MODAL ĐÁNH GIÁ (ĐÃ THU GỌN) */}
                        {job.status === 'In progress' && (
                             <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 text-white shadow-md">
                                        <CheckCircle className="w-4 h-4 mr-2" /> Hoàn thành
                                    </Button>
                                </DialogTrigger>
                                
                                {/* THAY ĐỔI 2: CSS CỦA MODAL (Thu gọn & Đè lên trên) 
                                    - fixed: Để cố định vị trí so với màn hình
                                    - z-50: Để đè lên mọi thứ
                                    - max-w-[90vw]: Để không bị tràn màn hình điện thoại
                                */}
                                <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[400px] bg-white p-6 rounded-xl shadow-2xl z-50 border border-gray-200"> 
                                    <DialogHeader>
                                        <DialogTitle className="text-center font-bold text-lg">Đánh giá dịch vụ</DialogTitle>
                                        <DialogDescription className="text-center text-xs">
                                            Chất lượng công việc của <b>{job.worker?.fullName}</b> thế nào?
                                        </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="flex flex-col items-center gap-4 py-4 w-full">
                                        {/* Sao thu gọn lại chút */}
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} type="button" onClick={() => setRating(star)}>
                                                    <Star className={`w-8 h-8 transition-colors ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <div className="text-xs font-bold text-purple-600">{rating > 0 ? `${rating} Sao` : "Chạm để đánh giá"}</div>

                                        <div className="w-full">
                                            <Label className="text-xs mb-1 block">Nhận xét</Label>
                                            <Textarea
                                                placeholder="Nhập nhận xét..."
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                className="resize-none h-20 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter className="flex-row gap-2 justify-end"> 
                                        <Button variant="ghost" size="sm" onClick={() => setIsReviewOpen(false)}>Hủy</Button>
                                        <Button size="sm" onClick={handleCompleteJob} disabled={isSubmitting} className="bg-purple-600 text-white">
                                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Gửi"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                        
                        {/* CASE: COMPLETED */}
                        {job.status === 'Completed' && job.review && (
                             <div className="flex items-center gap-1 text-yellow-600 text-sm font-bold bg-yellow-50 px-3 py-1 rounded-lg">
                                <Star className="w-4 h-4 fill-yellow-500" /> {job.review.rating}
                             </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        <div onClick={() => setIsFull(!isFull)} className="bg-gray-50 border-t border-gray-100 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-xs text-gray-500 font-medium uppercase tracking-wide gap-1">
            {isFull ? <>Thu gọn <ChevronUp className="w-3 h-3" /></> : <>Xem chi tiết & Thao tác <ChevronDown className="w-3 h-3" /></>}
        </div>
    </Card>
  )
}

export default JobCard;