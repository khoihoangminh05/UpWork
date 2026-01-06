import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import timeAgo from '@/lib/time'
import { Expand } from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import api from '@/config/axios'
import { toast } from 'sonner'
import { ConfirmDialog } from '../ConfirmDialog'

const JobCard = ({job, handleJobChange}) => {
  const [isFull, setIsFull] = useState(false);
  
  const deleteJob = async () => {
       try {
          const res = await api.delete("/jobs/" + job._id);
          toast.success(`Đã xóa công việc}`);
          console.log(res);
          handleJobChange();
       }
       catch(e) {
         console.log(e);
         toast.error("Xóa thất bại!");
       }
  }
  console.log(job);
  return (
    <Card className="flex flex-col p-3 group hover:shadow-glow text-base text-muted-foreground">
      <p className="text-gray-700">
        JOB:<span className="ml-3">{job.title} </span>
         <Badge variant="outline" className="mb-3 ml-4 py-1 border-accent text-muted-foreground">{job.category.name} {job.category.image} </Badge> 
      </p>
      <Separator className="bg-gray-200" />  
      <p className="text-sm mt-2"> Time: <span className="ml-2">{timeAgo(job.createdAt)}</span> </p>
      <p className="text-sm mt-2"> Client: <span className="ml-2">{job.client ? job.client.fullName: "None"}</span></p>
      <p className="text-sm mt-2"> Phone: <span className="ml-2">{job.phone}</span></p>
      <p className="text-sm mt-2"> Price: <span className="ml-2">{job.price} {job.paymentType}</span></p>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <p className="text-sm mt-2"> Status: <span className="ml-2 font-bold">{job.status}</span></p>
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
            <p className="text-sm mt-2"> Description: <span className="ml-2">{job.description}</span></p>

            <div className="flex text-sm mt-2">
              <Button variant="ghost" className="h-9 w-25 "> [Báo đã xong]</Button>
              <ConfirmDialog
                trigger={
                  <Button variant="ghost" className="h-9 w-25 font-semibold"> [Hủy Việc]</Button>
                }
                title="Bạn có chắc muốn xóa công việc này?"
                description="Đã xóa là mất luôn đấy!"
                confirmText="Chọn luôn"
                cancelText="Để em nghĩ lại"
                onConfirm={deleteJob}
              />
              <Button variant="ghost" className="h-9 w-25 "
                      onClick={()=> setIsFull(false)}
              > [Ẩn bớt]</Button>
            </div>
          </>
       } 
    </Card>
  )
}

export default JobCard