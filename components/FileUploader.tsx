"use client"

import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {Label} from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner"

type FileUploaderProps = {
    files: File[] | undefined,
    onChange: (files: File[], config: object) => void
}

const FileUploader = ({ files, onChange}: FileUploaderProps) => {
    const [isImporting, setIsImporting] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];

        // Ensure the file is a JSON file
        if (file.type !== 'application/json') {
            toast.error('Please upload a valid JSON file.');
            return;
        }

        const reader = new FileReader();
        setIsImporting(true);

        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result as string);
                // Delete the existing config from localStorage before setting the new one
                localStorage.removeItem('configJson');
                // Store the JSON object in localStorage as a string
                localStorage.setItem('configJson', JSON.stringify(json));
                console.log('configJson:', json);
                toast.success(`${file.name} File uploaded and saved successfully!`);
                // Optionally, you can update the parent component with the file
                onChange(acceptedFiles, json);
            } catch (error) {
                toast.error('Invalid JSON file.');
            }
            setIsImporting(false);
        };

        reader.onerror = () => {
            toast.error('Error reading the file.');
        };

        reader.readAsText(file);

    }, [onChange])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: { 'application/json': ['.json'] },
        onDrop,
        multiple: false, // Restrict to single file upload
    })

    return (
        <div {...getRootProps()} className="file-upload">
            <input {...getInputProps()} />
            {files && files?.length > 0 ?
                (<Label className="text-green-500">{files[0].name}</Label>) :
                (<>
                    <Image src="/assets/icons/upload.svg" alt="upload" width={40} height={40}/>
                    <div className="file-upload_label">
                        <p className="text-14-regular">
                            <span className="text-green-500">
                                Click to upload
                            </span> or drag and drop file here
                        </p>
                        <p>
                            Supported formats: .json
                        </p>
                    </div>
                </>)}
        </div>
    )
}

export default FileUploader