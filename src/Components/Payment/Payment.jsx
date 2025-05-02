import React, { useState } from "react";
import { FaCreditCard, FaMobileAlt, FaImage, FaCheck } from "react-icons/fa";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <div className="space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="رقم البطاقة" 
                className="w-full p-4 border-2 rounded-xl pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
              />
              <FaCreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  className="w-full p-4 border-2 rounded-xl pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                />
              </div>
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="CVV" 
                  className="w-full p-4 border-2 rounded-xl pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                />
              </div>
            </div>
          </div>
        );
      case "fawry":
      case "vodafone":
      case "instapay":
        return (
          <div className="space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder={paymentMethod === "fawry" ? "رقم الهاتف" : 
                           paymentMethod === "vodafone" ? "رقم فودافون كاش" : 
                           "رقم حساب إنستا باي"} 
                className="w-full p-4 border-2 rounded-xl pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
              />
              <FaMobileAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="payment-receipt"
              />
              <label htmlFor="payment-receipt" className="cursor-pointer">
                {selectedImage ? (
                  <div className="relative">
                    <img src={selectedImage} alt="إيصال الدفع" className="max-h-56 mx-auto rounded-xl shadow-md" />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaImage className="text-3xl text-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">اضغط لرفع صورة إيصال الدفع</p>
                      <p className="text-sm text-gray-500">أو اسحب وأفلت الصورة هنا</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">إتمام الدفع</h1>
        <p className="text-gray-600">أكمل عملية الدفع لتفعيل اشتراكك</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">تفاصيل الطلب</h2>
        <div className="space-y-4 text-gray-600">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
            <span className="text-lg">اسم الخدمة/المنتج:</span>
            <span className="font-medium text-gray-800">اشتراك مع الكوتش أحمد</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
            <span className="text-lg">السعر:</span>
            <span className="font-medium text-gray-800">500 جنيه / شهر</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">اختر وسيلة الدفع:</h3>
        <div className="grid grid-cols-2 gap-6">
          <button 
            onClick={() => setPaymentMethod("card")} 
            className={`p-6 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
              paymentMethod === "card" 
                ? "border-blue-500 bg-blue-50 text-blue-600 shadow-md" 
                : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              paymentMethod === "card" ? "bg-blue-500" : "bg-gray-100"
            }`}>
              <FaCreditCard className={`text-xl ${paymentMethod === "card" ? "text-white" : "text-gray-400"}`} />
            </div>
            <span className="text-lg font-medium">بطاقة ائتمان</span>
          </button>
          <button 
            onClick={() => setPaymentMethod("fawry")} 
            className={`p-6 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
              paymentMethod === "fawry" 
                ? "border-blue-500 bg-blue-50 text-blue-600 shadow-md" 
                : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              paymentMethod === "fawry" ? "bg-blue-500" : "bg-gray-100"
            }`}>
              <FaMobileAlt className={`text-xl ${paymentMethod === "fawry" ? "text-white" : "text-gray-400"}`} />
            </div>
            <span className="text-lg font-medium">فوري</span>
          </button>
          <button 
            onClick={() => setPaymentMethod("vodafone")} 
            className={`p-6 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
              paymentMethod === "vodafone" 
                ? "border-blue-500 bg-blue-50 text-blue-600 shadow-md" 
                : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              paymentMethod === "vodafone" ? "bg-blue-500" : "bg-gray-100"
            }`}>
              <FaMobileAlt className={`text-xl ${paymentMethod === "vodafone" ? "text-white" : "text-gray-400"}`} />
            </div>
            <span className="text-lg font-medium">فودافون كاش</span>
          </button>
          <button 
            onClick={() => setPaymentMethod("instapay")} 
            className={`p-6 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
              paymentMethod === "instapay" 
                ? "border-blue-500 bg-blue-50 text-blue-600 shadow-md" 
                : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              paymentMethod === "instapay" ? "bg-blue-500" : "bg-gray-100"
            }`}>
              <FaMobileAlt className={`text-xl ${paymentMethod === "instapay" ? "text-white" : "text-gray-400"}`} />
            </div>
            <span className="text-lg font-medium">إنستا باي</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-8">
        {renderPaymentFields()}
        <button className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all font-medium text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
          <FaCheck className="text-xl" />
          إتمام الدفع
        </button>
      </div>
    </div>
  );
} 