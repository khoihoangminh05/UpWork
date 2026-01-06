import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import timeAgo from '@/lib/time'
import { Expand } from 'lucide-react'
import { Button } from '../ui/button'
import { ConfirmDialog } from '../ConfirmDialog'
import { toast } from 'sonner'
import api from '@/config/axios'
import { useAuth } from '@/context/AuthContext'
import { Separator } from '../ui/separator'

const JobCard = ({job, handleJobChange}) => {
  const [isFull, setIsFull] = useState(false);
  const { user } = useAuth();
  const handleAcceptJob = async () => {
     if(user.role !== 'worker') {
        toast.info("Bạn không phải công nhân!");
        return;
     }
     try {
        await api.put(`jobs/${job._id}/accept`);
        toast.success("Nhận việc thành công!")
        handleJobChange();
     }
     catch(e) {
      console.log(e);
      toast.error("Nhận việc thất bại!")
     }
  }
  return (
    <Card className="flex p-3 group hover:shadow-glow text-muted-foreground">
        <div className="flex flex-1 flex-col gap-4 text-md w-full">
           <div className="flex items-center justify-left gap-10">
             <p> {job.title} </p>
             <Badge variant="outline" className="p-2">
               {job.category.name}  {job.category.image}
             </Badge> 
           </div >
           <Separator className="bg-gray-200" /> 
           <div className="flex text-sm text-muted-foreground items-center gap-6 ">
            <p>🏠 Address: {job.address} </p> 
            <p>💰 Price: {job.price} {job.paymentType}</p> 
            <p>📞 Contact: {job.phone.slice(0,3)}XXXXX </p>
           </div>
           <div className="flex gap-6 text-sm text-muted-foreground">
            <p> {timeAgo(job.createdAt)} </p>
            {!isFull && 
               <Button 
                 size="sm" variant="ghost" className="mt-[-7px]"
                 onClick={()=> setIsFull(true)}
               >[Xem chi tiết] 
               </Button> 
            }
           </div>
           
           {
            isFull && 
            <>
              <p className="text-sm"> Description: <span className="ml-2">{job.description}</span></p>

              <div className="flex text-sm">
                <ConfirmDialog
                  trigger={
                    <Button variant="ghost" className="h-9 w-25 font-semibold"> [Nhận Việc]</Button>
                  }
                  title="Bạn có chắc muốn nhận công việc này?"
                  description="Bạn sẽ bị trừ 50000VNĐ vào tài khoản để nhận việc!"
                  confirmText="Chọn luôn"
                  cancelText="Để em nghĩ lại"
                  onConfirm={() => {
                    handleAcceptJob();
                  }}
                />
                <Button variant="ghost" className="h-9 w-25 "
                        onClick={()=> setIsFull(false)}
                > [Ẩn bớt]</Button>
              </div>
            </>
          } 
        </div>
        
    </Card>
  )
}

export default JobCard