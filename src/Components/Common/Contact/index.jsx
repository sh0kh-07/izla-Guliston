import { useState } from "react";
import { Card, CardBody, Typography, Button, Input, Textarea } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useCreateMessageMutation } from "../../../store/services/messages.api";

export default function Contact() {
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        note: "",
    });

    const [createMessage, { isLoading }] = useCreateMessageMutation();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createMessage(formData).unwrap();
            await Swal.fire({
                icon: "success",
                title: "Xabar yuborildi!",
                text: "Xabaringiz uchun rahmat! Tez orada siz bilan bog'lanamiz.",
                confirmButtonColor: "#3B82F6",
                confirmButtonText: "Yopish",
                timer: 3000,
                timerProgressBar: true,
            });
            setFormData({ full_name: "", phone: "", note: "" });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Xatolik yuz berdi!",
                text: error?.data?.message || "Iltimos qaytadan urinib ko'ring.",
                confirmButtonColor: "#EF4444",
                confirmButtonText: "Yopish",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header qismi */}
                <div className="text-center mb-2">
                    <Typography
                        variant="h1"
                        className="font-bold text-gray-800 text-4xl md:text-5xl mb-4"
                    >
                        Biz bilan bog'lanish
                    </Typography>
                    <Typography
                        variant="lead"
                        className="text-gray-600 max-w-2xl mx-auto"
                    >
                        Savollaringiz bormi? Quyidagi formani to'ldiring va yuboring.
                    </Typography>
                </div>

                {/* Asosiy kontakt form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-0 shadow-lg col-span-2">
                        <CardBody className="p-4">
                            <Typography variant="h3" className="font-bold text-gray-800 mb-6">
                                Xabar yuborish
                            </Typography>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        label="Ismingiz"
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        label="Telefon raqamingiz"
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <Textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={handleChange}
                                        label="Xabaringiz"
                                        className="w-full min-h-[150px]"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                                >
                                    {isLoading ? "Yuborilmoqda..." : "Xabarni yuborish"}
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}