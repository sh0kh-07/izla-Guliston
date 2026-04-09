import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, CubeIcon } from "@heroicons/react/24/outline";
import { useGetCategoriesQuery, useGetSubCategoriesQuery } from "../../../store/services/category.api";
import { useGetProductsQuery } from "../../../store/services/product.api";
import { CategoryCreateModal } from "./__components/CategoryCreateModal";
import { CategoryEditModal } from "./__components/CategoryEditModal";
import { CategoryDeleteModal } from "./__components/CategoryDeleteModal";
import Loading from "../../Other/UI/Loadings/Loading";
import EmptyData from "../../Other/UI/NoData/EmptyData";

export default function AdminCategoryManager() {
    const { parentId } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    // Fetch categories (root if no parentId, otherwise sub-categories)
    const { data: rootData, isLoading: isRootLoading } = useGetCategoriesQuery(page, { skip: !!parentId });
    const { data: subData, isLoading: isSubLoading } = useGetSubCategoriesQuery({ parentId, page }, { skip: !parentId });

    // Check if current category has products
    const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery({ categoryId: parentId, page: 1 }, { skip: !parentId });

    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleOpenCreate = () => setOpenCreate(!openCreate);
    const handleOpenEdit = (category) => {
        setSelectedCategory(category);
        setOpenEdit(!openEdit);
    };
    const handleOpenDelete = (id) => {
        setSelectedCategory(id);
        setOpenDelete(!openDelete);
    };

    const categories = parentId ? (subData?.data?.records || []) : (rootData?.data?.records || []);
    const meta = parentId ? subData?.data?.meta : rootData?.data?.meta;
    const products = productsData?.data?.records || [];

    const hasProducts = products.length > 0;
    const hasSubCategories = categories.length > 0;

    // Automatically redirect to products if they exist for this category
    React.useEffect(() => {
        if (!isProductsLoading && hasProducts && parentId) {
            navigate(`/admin/products/${parentId}`, { replace: true });
        }
    }, [isProductsLoading, hasProducts, parentId, navigate]);

    if (isRootLoading || isSubLoading || isProductsLoading) return <Loading />;

    // While redirecting, show loading
    if (hasProducts && parentId) return <Loading />;

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-[20px]">
                <div className="flex flex-col">
                    <Typography variant="h3" color="blue-gray" className="font-bold">
                        {parentId ? "Sub-kategoriyalar" : "Asosiy kategoriyalar"}
                    </Typography>
                </div>

                <div className="flex gap-2">
                    {!hasProducts && (
                        <Button
                            className="flex items-center gap-3 bg-blue-600 shadow-md hover:shadow-lg rounded-xl transition-all active:scale-95"
                            onClick={handleOpenCreate}
                        >
                            <PlusIcon className="h-5 w-5" /> Yangi qo'shish
                        </Button>
                    )}
                    {parentId && !hasSubCategories && (
                        <Button
                            color="green"
                            className="flex items-center gap-3 shadow-md hover:shadow-lg rounded-xl transition-all active:scale-95"
                            onClick={() => navigate(`/admin/products/create/${parentId}`)}
                        >
                            <CubeIcon className="h-5 w-5" /> Malumot qo'shish
                        </Button>
                    )}
                </div>
            </div>

            {categories.length === 0 ? (
                <EmptyData text={parentId ? "Ushbu kategoriya uchun sub-kategoriyalar topilmadi" : "Hech qanday kategoriya topilmadi"} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {categories.map((category) => (
                        <Card key={category.id} className="w-full shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-2xl overflow-hidden group">
                            <CardHeader className="relative h-48 m-0 rounded-none shadow-none bg-gray-50 flex items-center justify-center overflow-hidden">
                                {category.image ? (
                                    <img
                                        src={`https://dev.izlaguliston.uz/${category.image}`}
                                        alt={category.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 opacity-40">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                        <Typography variant="small" className="font-bold uppercase tracking-widest text-[10px]">
                                            Rasm yuklanmagan
                                        </Typography>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                            </CardHeader>
                            <CardBody className="p-4">
                                <Typography variant="h5" color="blue-gray" className="mb-4 font-bold truncate">
                                    {category.title}
                                </Typography>
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        size="sm"
                                        color="blue-gray"
                                        className="p-2 rounded-lg transition-transform active:scale-90"
                                        onClick={() => navigate(`/admin/category/${category.id}`)}
                                        title="Sub-kategoriyalarni ko'rish"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="blue"
                                        className="p-2 rounded-lg transition-transform active:scale-90"
                                        onClick={() => handleOpenEdit(category)}
                                        title="Tahrirlash"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="red"
                                        className="p-2 rounded-lg transition-transform active:scale-90"
                                        onClick={() => handleOpenDelete(category.id)}
                                        title="O'chirish"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta && meta.lastPage > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                    <Button
                        variant="text"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Oldingi
                    </Button>
                    <div className="flex items-center gap-2">
                        <Typography color="gray" className="font-medium">
                            Sahifa {page} / {meta.lastPage}
                        </Typography>
                    </div>
                    <Button
                        variant="text"
                        disabled={page === meta.lastPage}
                        onClick={() => setPage(page + 1)}
                    >
                        Keyingi
                    </Button>
                </div>
            )}

            {/* Modals */}
            <CategoryCreateModal
                open={openCreate}
                handleOpen={handleOpenCreate}
                parentId={parentId}
            />
            <CategoryEditModal
                open={openEdit}
                handleOpen={() => setOpenEdit(false)}
                category={selectedCategory}
            />
            <CategoryDeleteModal
                open={openDelete}
                handleOpen={() => setOpenDelete(false)}
                categoryId={selectedCategory}
            />
        </div>
    );
}
