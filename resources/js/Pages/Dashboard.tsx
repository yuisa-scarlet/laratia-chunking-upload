import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import { createUpload } from "@mux/upchunk";

type Props = {
    files: Array<{ id: number; file_path: string }>;
};

export default function Dashboard({ files }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { csrf_token } = usePage().props as unknown as { csrf_token: string };

    const [_, setFile] = useState<File | null>(null);
    const [uploader, setUploader] = useState<ReturnType<
        typeof createUpload
    > | null>(null);

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
                        <div className="p-6 text-gray-900">
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
