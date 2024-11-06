import React from 'react'
import {Button} from "@/components/ui/button";
import Image from "next/image";

interface ButtonProps {
    isLoading: boolean
    className?: string
    onClick?: () => void
    children: React.ReactNode
}

const RegularButton = ({isLoading, className, children, onClick}: ButtonProps) => {
    return (
        <Button type="button"
                disabled={isLoading}
                onClick={onClick}
                className={className ?? 'shad-primary-btn w-full'}
                aria-label={isLoading ? "Loading..." : `${children}`}>
            {isLoading ?
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