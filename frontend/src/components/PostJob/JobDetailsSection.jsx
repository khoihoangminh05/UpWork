import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup, 
  SelectLabel, 
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import api from "@/config/axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const MapPinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>);
const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const CalculatorIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>);

export const JobDetailsSection = () => {
  const [services, setServices] = useState([]);
  
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  
  const [quantity, setQuantity] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [customPrice, setCustomPrice] = useState(""); 

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const res = await api.get('/category'); 
            setServices(res.data);
        } catch (err) {
            console.error("Lỗi lấy danh mục:", err);
            toast.error("Không tải được danh sách dịch vụ");
        }
    }
    fetchCategories();
  }, []);

  const handleServiceChange = (serviceId) => {
    setSelectedServiceId(serviceId);
    const service = services.find(s => s._id === serviceId);
    
    if (service) {
      setTitle(service.name);
      setCustomPrice(service.basePrice);
      setQuantity(""); 
      setStartTime("");
      setEndTime("");
    }
  };

  const calculateTotal = () => {
    const service = services.find(s => s._id === selectedServiceId);
    if (!service || !customPrice) return 0;
    
    if (service.inputType === "time") {
        if(!startTime || !endTime) return 0;
        const start = parseInt(startTime.split(":")[0]);
        const end = parseInt(endTime.split(":")[0]);
        let hours = end - start;
        if (hours <= 0) hours = 0; 
        return hours * customPrice;
    }
    
    if (service.inputType === "area" || service.inputType === "quantity") {
        return (quantity || 0) * customPrice;
    }

    return customPrice; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== 'client') {
      toast.error("Chỉ tài khoản Khách hàng mới được đăng việc!");
      return;
    }

    setLoading(true);
    const service = services.find(s => s._id === selectedServiceId);

    const autoDetail = `
      Dịch vụ: ${service?.name}
      ${quantity ? `Số lượng/Diện tích: ${quantity} ${service?.unit}` : ''}
      ${startTime ? `Thời gian: ${startTime} - ${endTime}` : ''}
      Đơn giá: ${Number(customPrice).toLocaleString()} VND/${service?.unit}
      Tổng ước tính: ${Number(calculateTotal()).toLocaleString()} VND
    `;

    const job = {
      title,
      address,
      phone,
      price: calculateTotal(), 
      paymentType: `${service?.unit}`,
      category: service?._id, 
      description: `${description}\n\n-- Chi tiết hệ thống --\n${autoDetail}`,
      startTime,
      endTime,
      startDate
    };

    try {
      await api.post('/jobs', job);
      toast.success("Đăng công việc thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Đăng việc thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const currentService = services.find(s => s._id === selectedServiceId);
  const basicServices = services.filter(s => s.code === 'hourly' || s.code === 'general_deep');
  
  const specializedServices = services.filter(s => s.code !== 'hourly' && s.code !== 'general_deep');

  const renderServiceItem = (service) => (
    <SelectItem key={service._id} value={service._id} className="cursor-pointer">
       <div className="flex items-center gap-3 py-1">
             {service.image}
          
          <div className="flex flex-col text-left">
             <span className="font-semibold text-gray-800">{service.name}</span>
             <span className="text-xs text-gray-500">{Number(service.basePrice).toLocaleString()}đ / {service.unit}</span>
          </div>
       </div>
    </SelectItem>
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
            <h1 className="text-3xl font-bold">Đăng yêu cầu dịch vụ</h1>
            <p className="text-purple-100 mt-2 text-sm">Chọn loại dịch vụ bạn cần, hệ thống sẽ tính toán chi phí ước tính.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
          
          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-700">Loại dịch vụ <span className="text-red-500">*</span></Label>
            
            <Select onValueChange={handleServiceChange}>
                <SelectTrigger className="h-16 text-lg border-gray-200 focus:ring-purple-200">
                    <SelectValue placeholder="-- Chọn dịch vụ bạn cần --" />
                </SelectTrigger>
                
                <SelectContent className="max-h-[400px]">
                    
                    <SelectGroup>
                        <SelectLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-2">
                           Dịch vụ phổ thông
                        </SelectLabel>
                        {basicServices.map(renderServiceItem)}
                    </SelectGroup>

                    <div className="h-px bg-gray-100 my-1 mx-2"></div>

                    <SelectGroup>
                        <SelectLabel className="text-xs font-bold text-purple-600 uppercase tracking-wider px-2 py-2 bg-purple-50 rounded-md mb-1 mx-1 mt-1 flex items-center gap-1">
                           ✨ Dịch vụ chuyên sâu
                        </SelectLabel>
                        {specializedServices.map(renderServiceItem)}
                    </SelectGroup>

                </SelectContent>
            </Select>
            
            {currentService && currentService.hint && (
                <p className="text-sm text-purple-600 font-medium bg-purple-50 p-3 rounded-lg border border-purple-100">
                    ℹ️ Đơn giá tham khảo: {currentService.hint}
                </p>
            )}
          </div>

          {currentService && (
             <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    
                    {currentService.inputType === "time" && (
                        <>
                            <div className="space-y-2">
                                <Label>Giờ bắt đầu</Label>
                                <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="bg-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Giờ kết thúc</Label>
                                <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required className="bg-white" />
                            </div>
                        </>
                    )}

                    {(currentService.inputType === "area" || currentService.inputType === "quantity") && (
                        <div className="col-span-2 space-y-2">
                            <Label className="text-base">
                                {currentService.inputType === "area" ? "Diện tích (m2)" : `Số lượng (${currentService.unit})`} <span className="text-red-500">*</span>
                            </Label>
                            <Input 
                                type="number" 
                                placeholder={currentService.inputType === "area" ? "Nhập diện tích sàn..." : "Nhập số lượng..."}
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                required
                                min="1"
                                className="h-12 text-lg bg-white" 
                            />
                        </div>
                    )}

                     <div className="col-span-2 space-y-2 mt-2">
                        <Label>Đơn giá mong muốn (VND/{currentService.unit})</Label>
                        <div className="relative">
                            <Input 
                                type="number" 
                                value={customPrice}
                                onChange={e => setCustomPrice(e.target.value)}
                                className="pl-4 h-11 bg-white border-purple-200 focus:border-purple-500 text-purple-700 font-bold"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">VND</div>
                        </div>
                        <p className="text-xs text-gray-500">* Giá này được lấy từ hệ thống, bạn có thể điều chỉnh nếu cần.</p>
                     </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Ngày thực hiện</Label>
                        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Số điện thoại</Label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><PhoneIcon /></div>
                            <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="pl-10" placeholder="09xxxx" required />
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Địa chỉ chi tiết</Label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><MapPinIcon /></div>
                            <Input type="text" value={address} onChange={e => setAddress(e.target.value)} className="pl-10" placeholder="Số nhà, đường, phường..." required />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-2">
                        <Label>Ghi chú thêm</Label>
                        <Textarea 
                            placeholder="Ví dụ: Nhà có trẻ nhỏ, cần mang thang gấp..." 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            className="min-h-[120px]"
                        />
                    </div>
                    
                    <div className="w-full md:w-1/3 bg-indigo-900 text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg">
                        <div>
                            <div className="flex items-center gap-2 mb-4 opacity-80"><CalculatorIcon /> <span className="font-medium">Ước tính chi phí</span></div>
                            <div className="text-sm opacity-70 mb-1">Dịch vụ: {currentService.name}</div>
                            <div className="text-sm opacity-70 mb-1">Đơn giá: {Number(customPrice).toLocaleString()} đ/{currentService.unit}</div>
                            {(quantity || (startTime && endTime)) && (
                                <div className="text-sm opacity-70">
                                    Số lượng: {currentService.inputType === 'time' ? 'Theo giờ' : `${quantity} ${currentService.unit}`}
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <div className="text-3xl font-bold text-yellow-400 tracking-tight">
                                {Number(calculateTotal()).toLocaleString()} đ
                            </div>
                            <div className="text-xs text-indigo-200 mt-1">Chưa bao gồm phụ phí phát sinh (nếu có)</div>
                        </div>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl rounded-xl"
                >
                    {loading ? "Đang xử lý..." : `Đăng việc ngay (${Number(calculateTotal()).toLocaleString()} đ)`}
                </Button>
             </div>
          )}

          {!currentService && (
             <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                <span className="text-4xl block mb-2">👇</span>
                Vui lòng chọn loại dịch vụ ở trên để tiếp tục
             </div>
          )}
        </form>
      </Card>
    </div>
  );
};