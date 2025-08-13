import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useMemo, useRef, useState } from "react";
import { createUpload } from "@mux/upchunk";

type Props = {
    files: Array<{ id: number; file_path: string }>;
};

const initialState = {
    file: null as File | null,
    uploader: null as ReturnType<typeof createUpload> | null,
    progress: 0,
    uploading: false,
    error: null as string | null,
};

export default function Dashboard({ files }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { csrf_token } = usePage().props as unknown as { csrf_token: string };

    const [_file, setFile] = useState<File | null>(initialState.file);
    const [uploader, setUploader] = useState<ReturnType<
        typeof createUpload
    > | null>(initialState.uploader);
    const [uploadProgress, setUploadProgress] = useState<number>(
        initialState.progress
    );
    const [uploading, setUploading] = useState<boolean>(initialState.uploading);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(initialState.error);

    const formattedProgress = useMemo(
        () => Math.round(uploadProgress),
        [uploadProgress]
    );

    const reset = () => {
        setFile(initialState.file);
        setUploader(initialState.uploader);
        setUploadProgress(initialState.progress);
        setUploading(initialState.uploading);
        setIsPaused(false);
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

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!fileInputRef.current || !fileInputRef.current.files) return;

        const selectedFile = fileInputRef.current.files[0];
        setFile(selectedFile);

        // Start uploading
        const uploader = createUpload({
            endpoint: route("file.store"),
            headers: {
                "X-CSRF-TOKEN": csrf_token,
            },
            method: "POST",
            file: selectedFile,
            chunkSize: 1024 * 5, // 5MB
        });
        setUploader(uploader);

        uploader.on("attempt", () => {
            // Reset progress and error state
            setError(null);
            // Show upload progress
            setUploading(true);
        });

        uploader.on("progress", (event) => {
            // Update progress state
            setUploadProgress(event.detail);
        });

        uploader.on("success", () => {
            // Update progress state
            router.reload({
                only: ["files"],
            });
            reset();
        });

        uploader.on("error", (error) => {
            setError(error.detail.message);
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-2">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-4">
                            <form onSubmit={submit}>
                                <div className="flex items-center">
                                    <input
                                        type="file"
                                        name="file"
                                        ref={fileInputRef}
                                        className="flex-grow"
                                    />
                                    <PrimaryButton>Upload</PrimaryButton>
                                </div>
                            </form>

                            {uploading && (
                                <div>
                                    <div className="bg-gray-100 shadow-inner h-3 rounded-full overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-full transition-all duration-200"
                                            style={{
                                                width: `${uploadProgress}%`,
                                            }}
                                        ></div>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex space-x-2 items-center">
                                            {error ? (
                                                <button
                                                    type="button"
                                                    className="text-sm text-blue-500"
                                                    onClick={submit}
                                                >
                                                    Reupload
                                                </button>
                                            ) : isPaused ? (
                                                <button
                                                    type="button"
                                                    className="text-sm text-blue-500"
                                                    onClick={resume}
                                                >
                                                    Resume
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="text-sm text-blue-500"
                                                    onClick={pause}
                                                >
                                                    Pause
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="text-sm text-red-500"
                                                onClick={cancel}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <div>{formattedProgress}%</div>
                                    </div>

                                    {error && (
                                        <div className="mt-2 text-sm text-red-500">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {files.length === 0 ? (
                                <p>No files uploaded yet.</p>
                            ) : (
                                files.map((file, idx) => (
                                    <div key={file.id} className="mb-4">
                                        <p className="text-sm text-gray-600">
                                            File Path: {file.file_path}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
