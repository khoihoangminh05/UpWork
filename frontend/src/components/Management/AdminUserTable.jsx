import { Card } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import api from '@/config/axios';
import { toast } from 'sonner';
import timeAgo from '@/lib/time';
import { Button } from '../ui/button';
import { DepositDialog } from './DepositDialog';

const AdminUserTable = () => {
    const [users, setUsers] = useState([]);

    const fetchData = async () => {
      try{ 
         const res = await api.get('/auth');
         console.log(res);
         toast.success("Lấy danh sách thông tin user thành công")
         setUsers(res.data);
      }
      catch(e) {
        console.log(e);
        toast.error("Lỗi khi lấy thông tin user")
      }
    }

    useEffect(() => {
       fetchData();
    },[]);
   
  let total = 0;
  users.forEach((e) => total += e.walletBalance)

  return (
    <Card className="m-2 p-6 w-full "> 
        <Table>
        <TableCaption>A list of Users.</TableCaption>
        <TableHeader>
            <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>FullName</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead>Wallet Balance</TableHead>
            <TableHead>Deposit</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
        {users.map((user) => (
          <TableRow key={user.email}>
            <TableCell className="font-medium h-13">{user.email}</TableCell>
            <TableCell>{user.fullName}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{timeAgo(user.createdAt)}</TableCell>
            <TableCell>{user.walletBalance} VND</TableCell>
            { (user.role === "worker") &&
              <TableCell>
              <DepositDialog
               trigger={ 
                  <Button 
                    className="w-10 h-9"
                    variant="outline"
                  >
                    +/-
                  </Button>}
                user={user}
                onChange={fetchData}
              >
              </DepositDialog>
            </TableCell>
          }
          </TableRow>
        ))}
        </TableBody>
        <TableFooter>
            <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell> {total} VNĐ</TableCell>
            </TableRow>
        </TableFooter>
        </Table>
    </Card>
  )
}

export default AdminUserTable