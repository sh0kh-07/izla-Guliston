import React, { useState, useEffect } from "react";
import {
    Dialog,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import { Search as SearchIcon, X, ArrowRight, Package, Grid } from "lucide-react";
import { useSearchProductsQuery } from "../../../../store/services/product.api";
import { useNavigate } from "react-router-dom";

export default function Search({ open, handleOpen }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: response, isLoading } = useSearchProductsQuery(
        { searchTerm: debouncedTerm },
        { skip: debouncedTerm.length < 2 }
    );

    const data = response?.data;

    const handleNavigate = (type, item) => {
        handleOpen();
        setSearchTerm("");
        if (type === "category") {
            navigate(`/category/${item.id}`);
        } else {
            navigate(`/products/${item.id}`);
        }
    };

    const stripHtml = (html) => {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    return (
        <Dialog
            open={open}
            handler={handleOpen}
            size="xxl"
            className="bg-transparent shadow-none"
        >
            <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-[9999] overflow-y-auto">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Typography variant="h4" color="blue-gray" className="font-bold">
                            Qidiruv
                        </Typography>
                        <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={handleOpen}
                            className="rounded-full"
                        >
                            <X className="h-6 w-6" />
                        </IconButton>
                    </div>

                    {/* Search Input */}
                    <div className="relative mb-8">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-4 border-b-2 border-blue-500 bg-transparent text-xl focus:outline-none placeholder-gray-400"
                            placeholder="Nimadir izlayapsizmi?..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Results */}
                    <div className="space-y-8 pb-10">
                        {isLoading && (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        )}

                        {!isLoading && debouncedTerm.length >= 2 && (!data || (data.products?.records?.length === 0 && data.categories?.records?.length === 0)) && (
                            <div className="text-center py-10">
                                <Typography color="gray" className="text-lg">
                                    Hech narsa topilmadi
                                </Typography>
                            </div>
                        )}

                        {!isLoading && data && (
                            <>
                                {/* Categories Section */}
                                {data.categories?.records?.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Grid className="h-5 w-5 text-blue-500" />
                                            <Typography variant="h6" color="blue-gray" className="uppercase tracking-wider text-xs font-bold">
                                                Kategoriyalar
                                            </Typography>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {data.categories.records.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => handleNavigate("category", cat)}
                                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors text-left border border-gray-100"
                                                >
                                                    <span className="font-medium text-gray-800 line-clamp-1">{cat.title}</span>
                                                    <ArrowRight className="h-4 w-4 text-gray-400" />
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Info/Products Section */}
                                {data.products?.records?.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Package className="h-5 w-5 text-blue-500" />
                                            <Typography variant="h6" color="blue-gray" className="uppercase tracking-wider text-xs font-bold">
                                                Malumot
                                            </Typography>
                                        </div>
                                        <div className="space-y-3">
                                            {data.products.records.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleNavigate("product", item)}
                                                    className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white hover:bg-blue-50 transition-all text-left border border-gray-100 shadow-sm"
                                                >
                                                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                        {item.image ? (
                                                            <img src={`https://dev.izlaguliston.uz/${item.image}`} alt="" className="h-full w-full object-cover rounded-xl" />
                                                        ) : (
                                                            <Package className="h-6 w-6 text-blue-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <Typography variant="h6" color="blue-gray" className="font-bold text-sm leading-tight line-clamp-1">
                                                            {item.title}
                                                        </Typography>
                                                     
                                                    </div>
                                                    <ArrowRight className="h-5 w-5 text-gray-400 pr-2" />
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        )}

                        {/* Popular Searches / Suggestions (Optional) */}
                        {searchTerm.length < 2 && (
                            <div className="py-10 text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                    <SearchIcon className="h-8 w-8 text-gray-300" />
                                </div>
                                <div>
                                    <Typography variant="h6" color="blue-gray" className="font-bold">
                                        Qidiruvni boshlang
                                    </Typography>
                                    <Typography color="gray" className="text-sm">
                                        Mahsulot yoki kategoriya nomini kiriting
                                    </Typography>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
