import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
} from "@material-tailwind/react";
import { useUpdateCategoryMutation } from "../../../../store/services/category.api";
import { Alert } from "../../../Other/UI/Alert/Alert";
import { ImageCropper } from "../../ImageCropper";

export function CategoryEditModal({ open, handleOpen, category }) {
    const [title, setTitle] = useState("");
    const [position, setPosition] = useState("");
    const [image, setImage] = useState(null);
    const [tempImage, setTempImage] = useState(null);
    const [openCropper, setOpenCropper] = useState(false);
    const [preview, setPreview] = useState(null);
    const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

    useEffect(() => {
        if (category) {
            setTitle(category.title);
            setPosition(category.position || "");
            setImage(null);
            setPreview(category.image ? `https://dev.ithubs.uz/search/${category.image}` : null);
        }
    }, [category]);

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
        setImage(croppedImage);
        setPreview(URL.createObjectURL(croppedImage));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        if (position !== "" && position !== null) {
            formData.append("position", position);
        }
        if (image) {
            formData.append("image", image);
        }

        try {
            await updateCategory({ id: category.id, formData }).unwrap();
            Alert("Kategoriya muvaffaqiyatli yangilandi", "success");
            handleOpen();
        } catch (err) {
            Alert(err.data?.message || "Xatolik yuz berdi", "error");
        }
    };

    return (
        <Dialog open={open} handler={handleOpen} size="sm" className="rounded-2xl">
            <form onSubmit={handleSubmit}>
                <DialogHeader className="flex flex-col items-start gap-1">
                    <Typography variant="h4" color="blue-gray">
                        Kategoriyani tahrirlash
                    </Typography>
                </DialogHeader>
                <DialogBody className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Kategoriya nomi
                        </Typography>
                        <Input
                            size="lg"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Pozitsiya
                        </Typography>
                        <Input
                            size="lg"
                            type="number"
                            placeholder="Masalan: 1"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Kategoriya rasmi (tanlash ixtiyoriy)
                        </Typography>
                        <input
                            type="file"
                            id="category-edit-image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="category-edit-image"
                            className="block w-full border-2 border-dashed border-blue-200 p-4 rounded-xl text-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-all group"
                        >
                            {preview ? (
                                <div className="relative inline-block">
                                    <img src={preview} alt="Preview" className="h-32 rounded-lg shadow-md" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg text-white font-bold backdrop-blur-[2px] text-xs">
                                        O'zgartirish
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-2 bg-blue-50 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-bold">
                                        Rasm yuklash
                                    </Typography>
                                </div>
                            )}
                        </label>
                    </div>
                </DialogBody>
                <DialogFooter className="gap-2">
                    <Button variant="text" color="red" onClick={handleOpen} disabled={isLoading}>
                        Bekor qilish
                    </Button>
                    <Button variant="gradient" color="blue" type="submit" loading={isLoading}>
                        Yangilash
                    </Button>
                </DialogFooter>
            </form>
            <ImageCropper
                open={openCropper}
                handleClose={() => setOpenCropper(false)}
                image={tempImage}
                onCropComplete={handleCropComplete}
            />
        </Dialog>
    );
}
