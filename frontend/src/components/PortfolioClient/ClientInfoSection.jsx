import React from 'react'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { useAuth } from '@/context/AuthContext';
import multiavatar from '@multiavatar/multiavatar/esm'
import api from '@/config/axios';
import { toast } from 'sonner';
import { Button } from '../ui/button';

const ClientInfoSection = () => {
  const { user, setUser } = useAuth();
  //console.log(user);
  const svg = multiavatar(user.avatarSeed || "example");
  const encoded = btoa(unescape(encodeURIComponent(svg)));

  const changeAvatar = async () => {
    try {
        let seed = Math.random().toString(36).substring(2, 10);
        await api.put('/auth/avatar', {seed});
        toast.success("Đổi ảnh thành công!");
        setUser({...user, avatarSeed: seed});

    } catch(err) {
       console.log(err);
       toast.error("Đổi ảnh thất bại!")
    }
     
  }
  return (
   
      <Card className="w-1/4 m-2 h-screen">
        <h3 className="text-lg font-semibold py-3 pl-3 ">Personal Information</h3>
        <Separator className="bg-gray-200" />
        <div className="w-full flex items-center justify-center h-40">

        <div className="flex flex-col items-center">
          <img src={`data:image/svg+xml;base64,${encoded}`} 
                className="size-20"
          />

          <Button 
            variant="ghost"
            className="h-8 mt-2 w-25"
            onClick={changeAvatar}
          > 
            Change Avatar
          </Button>
        </div>
        </div>

        <div className="flex flex-col gap-3 pl-3">
          <p>Name: {user.fullName}</p>
          <p>Role: {user.role==="admin" ? "Admin" : user.role ==="worker" ? "Công nhân" : "Khách hàng"} </p>
          <p>Contact: 0.779.XXX.XXX</p>
        </div>

      </Card>

  )
}

export default ClientInfoSection