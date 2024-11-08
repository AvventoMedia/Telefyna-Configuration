import React from 'react'
import {Button} from "@/components/ui/button";
import Image from "next/image";

interface ButtonProps {
    isLoading?: boolean
    className?: string
    name?: string
    onClick?: () => void
    variant?: "outline" | "default" | "destructive"
    children: React.ReactNode
}

const RegularButton = ({name,isLoading, className, children, onClick, variant}: ButtonProps) => {
    return (
        <Button type="button"
                disabled={isLoading}
                onClick={onClick}
                variant={variant}
                className={className ?? 'shad-primary-btn w-full'}
                aria-label={isLoading ? "Loading..." : `${children}`}>
            {isLoading ?
                name ?
                    name :
                    (<div className="flex items-center gap-4">
                        <Image src="/assets/icons/loader.svg"
                           alt="loader"
                           width={24} height={24}
                           className="animate-spin"/>
                    Loading...
                </div>)
                : children}
        </Button>
    )
}
export default RegularButton;