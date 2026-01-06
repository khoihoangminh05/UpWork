import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import timeAgo from '@/lib/time'
import { Star, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import api from '@/config/axios'
import { toast } from 'sonner'
import { ConfirmDialog } from '../ConfirmDialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea' 
import { Label } from '../ui/label' 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

const JobCard = ({ job, handleJobChange }) => {
  const [isFull, setIsFull] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [newDescription, setNewDescription] = useState(job.description);
  
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateJob = async () => {
    try {
      const res = await api.put("/jobs/" + job._id, { description: newDescription });
      toast.success(`Đã cập nhật công việc`);
      console.log(res);
      handleJobChange();
      setIsEditing(false);
    } catch (e) {
      console.log(e);
      toast.error("Cập nhật thất bại!");
    }
  }

  const deleteJob = async () => {
    try {
      await api.delete("/jobs/" + job._id);
      toast.success(`Đã xóa công việc`);
      handleJobChange();
    } catch (e) {
      console.log(e);
      toast.error("Xóa thất bại!");
    }
  }

  // Hàm xử lý hoàn thành công việc và gửi đánh giá
  const handleCompleteJob = async () => {
    if (rating === 0) {
      toast.warning("Vui lòng chọn số sao đánh giá!");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/jobs/${job._id}/complete`, {
        rating: rating,
        comment: reviewText
      });
      
      toast.success("Đã hoàn thành và gửi đánh giá!");
      setIsReviewOpen(false); 
      handleJobChange(); 
    } catch (e) {
      console.log(e);
      toast.error("Có lỗi xảy ra khi hoàn thành!");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="flex flex-col p-3 group hover:shadow-glow text-base text-muted-foreground transition-all">
      <p className="text-gray-700 font-medium">
        JOB:<span className="ml-3 font-normal">{job.title} </span>
        <Badge variant="outline" className="mb-3 ml-4 py-1 border-accent text-muted-foreground">
          {job.category?.name} {job.category?.image}
        </Badge>
      </p>
      <Separator className="bg-gray-200" />
      <p className="text-sm mt-2"> Time: <span className="ml-2">{timeAgo(job.createdAt)}</span> </p>
      <p className="text-sm mt-2"> Worker: <span className="ml-2 font-medium">{job.worker ? job.worker.fullName : "None"}</span></p>
      <p className="text-sm mt-2"> Price: <span className="ml-2">{job.price} {job.paymentType}</span></p>
      
      <div className="flex gap-6 text-sm text-muted-foreground items-center">
        <p className="text-sm mt-2"> Status: <span className="ml-2 font-semibold text-primary">{job.status}</span></p>
        { (!isFull && (job.status !== "Completed")) &&
          <Button size="sm" variant="ghost" className="ml-2 mt-2"
            onClick={() => setIsFull(true)}
          >[Xem chi tiết]
          </Button>
        }
      </div>

      {
        isFull && 
        <>
          <p className="text-sm mt-2 font-medium"> Description:</p>
          {!isEditing ? (<span className="ml-2 block my-1">{job.description}</span>)
            : (
              <Input type="text" value={newDescription}
                className="mt-1"
                onChange={(e) => setNewDescription(e.target.value)}
              />
            )
          }

          <div className="flex flex-wrap items-start justify-start gap-2 text-sm mt-4">
           
            {job.status === 'Open' &&
              (!isEditing ? (
                <Button variant="ghost" className="h-9 px-2"
                  onClick={() => setIsEditing(true)}> [Sửa nội dung]
                </Button>) : (
                <Button variant="ghost" className="h-9 px-2 text-green-600"
                  onClick={updateJob}> [Lưu thay đổi]
                </Button>)
              )
            }

      
            {job.status === 'In progress' && (
              <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-9 px-2 text-blue-600 font-semibold hover:text-blue-700">
                    [Hoàn thành]
                  </Button>
                </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]"> 
                    <DialogHeader>
                      <DialogTitle>Đánh giá công nhân</DialogTitle>
                      <DialogDescription>
                        Hãy đánh giá chất lượng công việc để hoàn tất đơn hàng này.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4 w-full"> 
                     
                      <div className="flex flex-col items-center gap-2">
                        <Label className="text-base">Mức độ hài lòng</Label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-8 h-8 cursor-pointer transition-colors ${
                                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                              onClick={() => setRating(star)}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground h-5 font-medium">
                          {rating === 1 && "Tệ"}
                          {rating === 2 && "Không hài lòng"}
                          {rating === 3 && "Bình thường"}
                          {rating === 4 && "Tốt"}
                          {rating === 5 && "Tuyệt vời"}
                        </span>
                      </div>

                      
                      <div className="grid gap-2 w-full">
                        <Label htmlFor="review">Nhận xét (Tùy chọn)</Label>
                        <Textarea
                          id="review"
                          placeholder="Người làm việc nhiệt tình, đúng giờ..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full max-w-full resize-none" 
                        />
                      </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2"> 
                      <Button variant="outline" onClick={() => setIsReviewOpen(false)} className="w-full sm:w-auto">Hủy</Button>
                      <Button onClick={handleCompleteJob} disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Xác nhận hoàn thành
                      </Button>
                    </DialogFooter>
                  </DialogContent>
              </Dialog>
            )}

            <ConfirmDialog
              trigger={
                <Button variant="ghost" className="h-9 px-2 font-semibold text-red-500 hover:text-red-600"> [Xóa Việc]</Button>
              }
              title="Bạn có chắc muốn xóa công việc này?"
              description="Hành động này không thể hoàn tác."
              confirmText="Xóa luôn"
              cancelText="Hủy"
              onConfirm={deleteJob}
            />
            
            <Button variant="ghost" className="h-9 w-20"
              onClick={() => setIsFull(false)}
            > [Ẩn bớt]</Button>
          </div>
        </>
      }
    </Card>
  )
}

export default JobCard