import { Card, CardBody, Typography } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";
import { useGetCategoriesQuery } from "../../../store/services/category.api";
import Loading from "../../Other/UI/Loadings/Loading";

export default function FirstPage() {
    const { data: categoriesData, isLoading } = useGetCategoriesQuery(1);
    const categories = categoriesData?.data?.records || [];

    if (isLoading) return (
        <div className="container mx-auto pt-28">
            <Loading />
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Kategoriyalar grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {categories.map((category) => (
                        <NavLink to={`/category/${category.id}`} key={category.id}>
                            <Card
                                className="group relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-0"
                            >
                                {/* Background Image with Overlay */}
                                <div className="absolute inset-0">
                                    <img
                                        src={`https://dev.ithubs.uz/search/${category.image}`}
                                        alt={category.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-[#2626267c] group-hover:opacity-90 group-hover:bg-[#0000005b] transition-opacity duration-500" />
                                </div>
                                {/* Content - с адаптивной высотой */}
                                <CardBody className="relative z-10 text-center p-4 sm:p-8 min-h-[150px] sm:min-h-[280px] flex flex-col items-center justify-center">
                                    <Typography
                                        variant="h2"
                                        className="font-bold !text-white relative z-[1000] mb-2 text-shadow-lg text-[35px] sm:text-2xl lg:text-4xl"
                                    >
                                        {category.title}
                                    </Typography>
                                </CardBody>
                            </Card>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}