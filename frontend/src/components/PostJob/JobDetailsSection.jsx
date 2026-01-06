import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import api from "@/config/axios";
import { toast } from "sonner";
import { CategoryList } from "./CategoryList";
import { useAuth } from "@/context/AuthContext";

export const JobDetailsSection = () => {
   const [title, setTitle] = useState("");
   const [select, setSelect] = useState("");
   const [address, setAddress] = useState("");
   const [phone, setPhone] = useState("");
   const [price, setPrice] = useState("");
   const [paymentType, setPaymentType] = useState("all");
   const [description, setDescription] = useState("");
   const { user } = useAuth();

   const handleSubmit = async (e) => {
     e.preventDefault();

     if(user.role !== 'client') {
        toast.info("Bạn không phải khách hàng!");
        return;
     }
     
     const job = {
      title,
      address,
      phone,
      price,
      paymentType,
      category: select,
      description,
    };

      try {
        const res = await api.post('/jobs', job);
        console.log(res.status);
        toast.success("Dăng công việc thành công.");

    } catch (err) {
      console.error('Đăng việc thất bại:', err.response?.data || err.message);
      toast.success("Đăng việc thất bại.");
    }
    };
  
    const ChooseCategory = (c) => {
      setSelect(c);
    }
   
  
  return (
     <div className="container mt-5">
      <form>
       <Card className="flex flex-col gap-3 w-150 mx-auto p-10 ">
         <Label htmlFor="title">Title </Label> 
         <Input
          type="text"
          id="title"
          placeholder="title?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
         />

         <Label className="mt-5">Select </Label> 
         <CategoryList setSelect={setSelect} />

         <Label htmlFor="address" className="mt-5">Address </Label> 
         <Input
          type="text"
          id="address"
          placeholder="address?"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
         />

         <Label htmlFor="phone" className="mt-5">Phone </Label> 
         <Input
          type="text"
          id="phone"
          placeholder="phone?"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
         />
         
         <Label htmlFor="time" className="mt-5">Choose time </Label> 
         <div className="flex gap-5" id="time" >
          <Input
            type="time"
            id="start-time"
          />

          <Input
            type="time"
            id="end-time"
          />
         </div>

         <Label htmlFor="price" className="mt-5">Choose price </Label> 
         <div className="flex gap-5" id="time" >
          <Input
            type="number"
            className="w-1/3"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          
          <Select 
            value={paymentType}
            onValueChange={(value) => {setPaymentType(value)}}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="VNĐ per hour">VND per hour</SelectItem>
                <SelectItem value="VNĐ per day">VND per day</SelectItem>
                <SelectItem value="VNĐ per week">VND per week</SelectItem>
                <SelectItem value="VNĐ per month">VND per month</SelectItem>
                <SelectItem value="VNĐ for all">VND for All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

         </div>

         <Label htmlFor="date-start" className="mt-5">Start Day</Label> 
         <Input
          type="date"
          id="date-start"
         />
         
         <Label htmlFor="description" className="mt-5">Description</Label> 
         <Textarea 
           id="description" 
           placeholder="Type your description here." 
           value={description}
           onChange={(e) => setDescription(e.target.value)}
         />
        <Button 
          type="submit" 
          className="mx-auto mt-5"
          onClick={handleSubmit}
        >
          Post
        </Button>
       </Card>
       </form>
     </div>
  );
};