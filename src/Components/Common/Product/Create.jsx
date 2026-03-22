import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    Input,
    Textarea,
    Typography,
} from "@material-tailwind/react";
import { useCreateProductMutation, useGetProductsQuery } from "../../../store/services/product.api";
import { Alert } from "../../Other/UI/Alert/Alert";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImageCropper } from "../ImageCropper";

export default function ProductCreate() {
    const { categoryId } = useParams();
    const navigate = useNavigate()
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery({ categoryId, page: 1 });

    // Safety redirect: only one product allowed per category
    React.useEffect(() => {
        if (!isProductsLoading && productsData?.data?.records?.length > 0) {
            navigate(`/admin/products/${categoryId}`, { replace: true });
        }
    }, [isProductsLoading, productsData, categoryId, navigate]);

    const [formData, setFormData] = useState({
        title: "",
        address: "",
        note: "",
        addressUrl: "",
        image: null,
    });
    const [tempImage, setTempImage] = useState(null);
    const [openCropper, setOpenCropper] = useState(false);
    const [preview, setPreview] = useState(null);

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
        if (!formData.title || !formData.address || !formData.image) {
            Alert("Iltimos, barcha majburiy maydonlarni to'ldiring", "error");
            return;
        }

        const data = new FormData();
        data.append("categoryId", categoryId);
        data.append("title", formData.title);
        data.append("address", formData.address);
        data.append("addressUrl", formData.addressUrl);
        data.append("image", formData.image);
        if (formData.note) data.append("note", formData.note);

        try {
            await createProduct(data).unwrap();
            Alert("Mahsulot muvaffaqiyatli yaratildi", "success");
            navigate(`/admin/products/${categoryId}`, { replace: true });
        } catch (err) {
            Alert(err.data?.message || "Xatolik yuz berdi", "error");
        }
    };

    return (
        <div className=" mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Typography variant="h3" color="blue-gray" className="font-bold">
                    Yangi mahsulot qo'shish
                </Typography>
            </div>

            <Card className="shadow-lg border border-gray-100 rounded-2xl">
                <CardBody p={8}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                name="title"
                                label="Mahsulot sarlavhasi *"
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
                                required
                            />
                        </div>

                        <Input
                            name="addressUrl"
                            label="Xarita manzili (URL) *"
                            size="lg"
                            placeholder="https://yandex.uz/maps/..."
                            value={formData.addressUrl}
                            onChange={handleChange}
                            required
                        />

                        <div className="flex flex-col gap-2">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Mahsulot rasmi *
                            </Typography>
                            <input
                                type="file"
                                id="product-image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="product-image"
                                className="block w-full border-2 border-dashed border-blue-200 p-8 rounded-2xl text-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-all group"
                            >
                                {preview ? (
                                    <div className="relative inline-block">
                                        <img src={preview} alt="Preview" className="h-48 rounded-xl shadow-lg" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl text-white font-bold backdrop-blur-[2px]">
                                            O'zgartirish
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
                                            Rasm yuklash учун bosing
                                        </Typography>
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Batafsil ma'lumot (Rich Text)
                            </Typography>
                            <div className="h-[300px] mb-12">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.note}
                                    onChange={(value) => setFormData(prev => ({ ...prev, note: value }))}
                                    style={{ height: '250px' }}
                                    placeholder="Mahsulot haqida batafsil ma'lumot kiriting..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <Button
                                variant="text"
                                color="red"
                                onClick={() => navigate(-1)}
                                className="px-8 rounded-xl"
                                disabled={isLoading}
                            >
                                Bekor qilish
                            </Button>
                            <Button
                                variant="gradient"
                                color="blue"
                                type="submit"
                                loading={isLoading}
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
