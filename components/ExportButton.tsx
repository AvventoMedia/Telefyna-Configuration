import React from 'react'
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {ButtonProps} from "@/components/RegularButton";

const ExportButton = ({ name, isLoading, className, children}: ButtonProps) => {
    return (
       <Button type="submit" disabled={isLoading} className={className ?? 'shad-primary-btn w-full'}>
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
export default ExportButton
