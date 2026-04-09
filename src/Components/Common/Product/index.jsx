import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useGetProductsQuery } from "../../../store/services/product.api";
import { ProductDeleteModal } from "./__components/ProductDeleteModal";
import Loading from "../../Other/UI/Loadings/Loading";
import EmptyData from "../../Other/UI/NoData/EmptyData";
import { ContactList } from "./__components/Contacts/ContactList";

export default function ProductList() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const { data: productsData, isLoading } = useGetProductsQuery({ categoryId, page });

    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleOpenDelete = (product) => {
        setSelectedProduct(product);
        setOpenDelete(true);
    };

    if (isLoading) return <Loading />;

    const products = productsData?.data?.records || [];
    const hasProduct = products.length > 0;
    const product = products[0]; 

    return (
        <div className="">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
                <Typography variant="h3" color="blue-gray" className="font-bold">
                    Mahsulotlar
                </Typography>

                {!hasProduct && (
                    <Button
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-md rounded-xl transition-all active:scale-95"
                        onClick={() => navigate(`/admin/products/create/${categoryId}`)}
                    >
                        <PlusIcon className="h-5 w-5" /> Yangi qo'shish
                    </Button>
                )}
            </div>

            {/* EMPTY */}
            {!hasProduct && <EmptyData text="Ushbu kategoriya uchun mahsulot topilmadi" />}

            {/* PRODUCT CARD */}
            {hasProduct && (
                <Card className="w-full mx-auto shadow-xl rounded-3xl overflow-hidden bg-white">
                    {/* IMAGE TOP */}
                    <div className="relative w-full h-[400px] sm:h-[500px]">
                        <img
                            src={`https://dev.izlaguliston.uz/${product.image}`}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h2 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg">
                                {product.title}
                            </h2>
                        </div>
                    </div>

                    {/* CARD CONTENT */}
                    <CardBody className="p-8 space-y-6">
                        {/* ADDRESS */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs uppercase text-gray-400 font-semibold">
                                    Manzil
                                </p>
                                <p className="text-gray-800 font-medium">{product.address}</p>
                            </div>
                        </div>

                        {/* LOCATION */}
                        {product.addressUrl && (
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-gray-400 font-semibold">
                                        Lokatsiya
                                    </p>
                                    <a
                                        href={product.addressUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 font-semibold hover:underline"
                                    >
                                        Xaritada ko‘rish →
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* NOTE */}
                        {product.note && (
                            <div className="border-t pt-4">
                                <p className="text-xs uppercase text-gray-400 font-semibold mb-2">
                                    Batafsil ma'lumot
                                </p>
                                <div
                                    dangerouslySetInnerHTML={{ __html: product.note }}
                                    className="prose prose-sm max-w-none text-gray-700"
                                />
                            </div>
                        )}

                        {/* CONTACTS */}
                        <div className="border-t pt-4">
                            <ContactList productId={product.id} />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button
                                fullWidth
                                size="lg"
                                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700"
                                onClick={() =>
                                    navigate(`/admin/products/edit/${product.id}`, {
                                        state: { product },
                                    })
                                }
                            >
                                <PencilIcon className="h-5 w-5" /> Tahrirlash
                            </Button>

                            <Button
                                fullWidth
                                size="lg"
                                variant="outlined"
                                color="red"
                                className="flex items-center justify-center gap-2 rounded-xl"
                                onClick={() => handleOpenDelete(product)}
                            >
                                <TrashIcon className="h-5 w-5" /> O‘chirish
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* DELETE MODAL */}
            <ProductDeleteModal
                open={openDelete}
                handleOpen={() => setOpenDelete(false)}
                productId={selectedProduct?.id}
            />
        </div>
    );
}