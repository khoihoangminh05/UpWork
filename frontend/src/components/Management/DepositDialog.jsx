import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/config/axios";
import { useState } from "react";
import { toast } from "sonner";

export function DepositDialog({
  trigger,
  user,
  onChange
}) {

  const [amount, setAmount] = useState(0);

  const handleDeposit = () => {
      try {
         let deposit = {
           userId: user._id,
           amount, 
           note:""
         };
         const res = api.post('/wallet/deposit', deposit);
         console.log(res);
         toast.success("Cập nhật số tiền thành công!")
         onChange();
      } 
      catch(e) {
        console.log(e);
        toast.error("Cập nhật thất bại!");
      }
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nạp tiền thủ công</DialogTitle>
            <DialogDescription>
              nhập số tiền khách đã nạp
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label >Người nhận tiền</Label>
              <Input type="text" className="w-60" value={user.fullName} />
            </div>
            <div className="grid gap-3">
              <Label > Số tiền nạp(VNĐ) </Label>
              <Input type="number" value={amount} 
                     className="w-60 border-w-2"
                     onChange={(e) => {setAmount(e.target.value)}}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="w-45 ">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="w-45" onClick={handleDeposit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
