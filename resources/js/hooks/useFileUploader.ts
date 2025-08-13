import { usePage } from "@inertiajs/react";
import { createUpload } from "@mux/upchunk";
import { useMemo, useRef, useState } from "react";

interface FileUploaderProps {
    csrfToken: string;
    onSuccess: () => void;
}

export function useFileUploader({ csrfToken, onSuccess }: FileUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [uploader, setUploader] = useState<ReturnType<
        typeof createUpload
    > | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const formattedProgress = useMemo(
        () => Math.round(uploadProgress),
        [uploadProgress]
    );

    const reset = () => {
        setFile(null);
        setUploader(null);
        setUploadProgress(0);
        setUploading(false);
        setIsPaused(false);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const cancel = () => {
        if (!uploader) return;
        uploader.abort();
        reset();
    };

    const pause = () => {
        if (!uploader) return;
        uploader.pause();
        setIsPaused(true);
    };

    const resume = () => {
        if (!uploader) return;
        uploader.resume();
        setIsPaused(false);
    };

    const submit = (event?: React.FormEvent) => {
        if (event) event.preventDefault();
        if (!fileInputRef.current || !fileInputRef.current.files) return;

        const selectedFile = fileInputRef.current.files[0];
        setFile(selectedFile);
        setError(null);

        const uploaderInstance = createUpload({
            endpoint: route("file.store"),
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            },
            method: "POST",
            file: selectedFile,
            chunkSize: 1024 * 5, // 5MB
        });
        setUploader(uploaderInstance);

        uploaderInstance.on("attempt", () => {
            setError(null);
            setUploading(true);
        });

        uploaderInstance.on("progress", (event) => {
            setUploadProgress(event.detail);
        });

        uploaderInstance.on("success", () => {
            onSuccess();
            reset();
        });

        uploaderInstance.on("error", (error) => {
            setError(error.detail.message);
        });
    };

    return {
        fileInputRef,
        file,
        uploader,
        uploadProgress,
        uploading,
        isPaused,
        error,
        formattedProgress,
        submit,
        pause,
        resume,
        cancel,
        reset,
        setFile,
    };
}
