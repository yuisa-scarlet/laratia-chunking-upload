import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useFileUploader } from "@/hooks/useFileUploader";
import { UploadForm } from "@/Components/UploadForm";
import { FileList } from "@/Components/FileList";

type Props = {
    files: Array<{ id: number; file_path: string }>;
};

export default function Dashboard({ files }: Props) {
    const { csrf_token } = usePage().props as unknown as { csrf_token: string };

    const {
        fileInputRef,
        uploadProgress,
        uploading,
        isPaused,
        error,
        formattedProgress,
        submit,
        pause,
        resume,
        cancel,
    } = useFileUploader({
        csrfToken: csrf_token,
        onSuccess: () => router.reload({ only: ["files"] }),
    });

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
                            <UploadForm
                                fileInputRef={fileInputRef}
                                uploadProgress={uploadProgress}
                                uploading={uploading}
                                isPaused={isPaused}
                                error={error}
                                formattedProgress={formattedProgress}
                                onSubmit={submit}
                                onPause={pause}
                                onResume={resume}
                                onCancel={cancel}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <FileList files={files} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
