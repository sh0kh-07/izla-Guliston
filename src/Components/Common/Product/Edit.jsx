import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    Input,
    Typography,
} from "@material-tailwind/react";
import { useUpdateProductMutation, useGetProductsQuery } from "../../../store/services/product.api";
import { Alert } from "../../Other/UI/Alert/Alert";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImageCropper } from "../ImageCropper";

export default function ProductEdit() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const [formData, setFormData] = useState({
        title: state?.product?.title || "",
        address: state?.product?.address || "",
        note: state?.product?.note || "",
        addressUrl: state?.product?.addressUrl || "",
        image: null,
    });
    const [tempImage, setTempImage] = useState(null);
    const [openCropper, setOpenCropper] = useState(false);
    const [preview, setPreview] = useState(
        state?.product?.image ? `https://dev.izlaguliston.uz/${state?.product?.image}` : null
    );

    // ========== KENGAYTIRILGAN QUILL MODULI ==========
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'align': [] }],  // chap, markaz, o‘ng, eni bo‘yicha
                ['link', 'image', 'video'],
                ['blockquote', 'code-block'],
                ['clean']
            ],
            handlers: {
                // Rasm yuklash uchun handler (agar server endpoint kerak bo‘lsa)
                // image: () => { ... }
            }
        }
    }), []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setTempImage(reader.result);
                setOpenCropper(true);
            };
        }
    };

    const handleCropComplete = (croppedImage) => {
        setFormData((prev) => ({ ...prev, image: croppedImage }));
        setPreview(URL.createObjectURL(croppedImage));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) {
            Alert("Iltimos, barcha majburiy maydonlarni to‘ldiring", "error");
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("address", formData.address);
        data.append("addressUrl", formData.addressUrl);
        if (formData.image) data.append("image", formData.image);
        if (formData.note) data.append("note", formData.note);

        try {
            await updateProduct({ id: productId, formData: data }).unwrap();
            Alert("Mahsulot muvaffaqiyatli tahrirlandi", "success");
            navigate(-1);
        } catch (err) {
            Alert(err.data?.message || "Xatolik yuz berdi", "error");
        }
    };

    return (
        <div className="mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Typography variant="h3" color="blue-gray" className="font-bold">
                    Mahsulotni tahrirlash
                </Typography>
            </div>

            <Card className="shadow-lg border border-gray-100 rounded-2xl">
                <CardBody className="p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                name="title"
                                label="Mahsulot nomi *"
                                size="lg"
                                placeholder="Masalan: Starbucks Coffee"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="address"
                                label="Manzil *"
                                size="lg"
                                placeholder="Toshkent, Chilonzor tumani..."
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <Input
                            name="addressUrl"
                            label="Xarita URL manzili *"
                            size="lg"
                            placeholder="https://yandex.uz/maps/..."
                            value={formData.addressUrl}
                            onChange={handleChange}
                        />

                        <div className="flex flex-col gap-2">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Mahsulot rasmi (o‘zgartirish uchun tanlang)
                            </Typography>
                            <input
                                type="file"
                                id="product-image-edit"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="product-image-edit"
                                className="block w-full border-2 border-dashed border-blue-200 p-8 rounded-2xl text-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-all group"
                            >
                                {preview ? (
                                    <div className="relative inline-block">
                                        <img src={preview} alt="Oldindan ko‘rish" className="h-48 rounded-xl shadow-lg" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl text-white font-bold backdrop-blur-[2px]">
                                            O‘zgartirish
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-blue-50 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                            </svg>
                                        </div>
                                        <Typography variant="small" color="blue-gray" className="font-bold">
                                            Rasm yuklash uchun bosing
                                        </Typography>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* KENGAYTIRILGAN RICH TEXT MUHARRIRI */}
                        <div className="flex flex-col gap-2">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Batafsil tavsif (boy matn)
                            </Typography>
                            <div style={{ height: "350px", marginBottom: "70px" }}>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.note}
                                    onChange={(value) => setFormData(prev => ({ ...prev, note: value }))}
                                    modules={modules}
                                    style={{ height: "100%" }}
                                    placeholder="Mahsulot haqida to‘liq ma’lumot kiriting. Matnni formatlang, rasm va video qo‘shing..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <Button
                                variant="text"
                                color="red"
                                onClick={() => navigate(-1)}
                                className="px-8 rounded-xl"
                                disabled={isUpdating}
                            >
                                Bekor qilish
                            </Button>
                            <Button
                                variant="gradient"
                                color="blue"
                                type="submit"
                                loading={isUpdating}
                                className="px-8 rounded-xl shadow-md hover:shadow-lg"
                            >
                                Saqlash
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>

            <ImageCropper
                open={openCropper}
                handleClose={() => setOpenCropper(false)}
                image={tempImage}
                onCropComplete={handleCropComplete}
            />
        </div>
    );
}