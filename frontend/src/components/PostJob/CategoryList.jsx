import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { useEffect } from "react";
import api from "@/config/axios";

export const CategoryList = ({setSelect}) => {

  const [category, setCategory] = useState([]);
  const fetchData = async() => {
    const res = await api.get('/category');
    setCategory(res.data);
  }
  useEffect(() => {
     fetchData();
  },[]);
  return (
         <Select 
           onValueChange={(value) => {
                 const item = category.find(c => c.name === value);
                setSelect(item._id);
          }}
           required
         >
               <SelectTrigger className="w-[180px]">
                 <SelectValue placeholder="Select a type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectGroup>
                   {category.map((c)=> (
                      <SelectItem 
                        key={c.name} 
                        value={c.name}
                      >
                        {c.name} {c.image}
                      </SelectItem>
                    ))
                   }
                 </SelectGroup>
               </SelectContent>
          </Select>
  )
}
