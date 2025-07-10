import { AppSidebar } from "@/Components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb"
import { Separator } from "@/Components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar"
import { PageProps } from "@/types"
import { usePage } from "@inertiajs/react"
import { useEffect } from "react"
import { toast } from "react-toastify"
import Toastify from '@/Components/Toastify';
import logo from "../../../public/images/logo stai.png"



const TestLayout = ({ title, children }: { title?: string; children: React.ReactNode }) => {
    const { auth } = usePage<PageProps>().props;
    const { flash } = usePage<PageProps>().props;
    useEffect(() => {
        if (flash && flash?.error) {
            toast.error(flash.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (flash && flash?.success) {
            toast.success(flash.success, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }, [flash]);

    return (
        <SidebarProvider>
            {flash?.success && <Toastify />}
            {flash?.error && <Toastify />}
            <AppSidebar />
            <SidebarInset>
                <header className="border-b-2 shadow-sm border-gray-200 mb-4 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 ">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />

                        {/* Ganti Breadcrumb dengan Logo dan Nama */}
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Logo" className="h-8 w-8" />
                            <h1 className="text-lg font-semibold text-gray-700 uppercase">STAI Taswirul Afkar</h1>
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>


    )
}

export default TestLayout;

