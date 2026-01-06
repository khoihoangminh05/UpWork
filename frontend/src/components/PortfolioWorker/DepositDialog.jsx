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

export function DepositDialog({trigger}) {

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
              chuyển khoản với nội dung: "NAPTIEN [SĐT_CUA_THO]" (Ví dụ: NAPTIEN 0987654321).
            </DialogDescription>
          </DialogHeader>
          <div >
            <img src="qr.jpg"></img>
          </div>
          <DialogFooter>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
