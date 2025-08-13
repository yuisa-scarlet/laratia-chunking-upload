import PrimaryButton from "./PrimaryButton";
import React from "react";

type UploadFormProps = {
    fileInputRef: React.RefObject<HTMLInputElement>;
    uploadProgress: number;
    uploading: boolean;
    isPaused: boolean;
    error: string | null;
    formattedProgress: number;
    onSubmit: (e?: React.FormEvent) => void;
    onPause: () => void;
    onResume: () => void;
    onCancel: () => void;
};

function ProgressBar({ progress }: { progress: number }) {
    return (
        <div className="bg-gray-100 shadow-inner h-3 rounded-full overflow-hidden">
            <div
                className="bg-blue-500 h-full transition-all duration-200"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
}

function UploadControls({
    error,
    isPaused,
    onSubmit,
    onPause,
    onResume,
    onCancel,
}: {
    error: string | null;
    isPaused: boolean;
    onSubmit: (e?: React.FormEvent) => void;
    onPause: () => void;
    onResume: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="flex space-x-2 items-center">
            {error ? (
                <button
                    type="button"
                    className="text-sm text-blue-500"
                    onClick={onSubmit}
                >
                    Reupload
                </button>
            ) : isPaused ? (
                <button
                    type="button"
                    className="text-sm text-blue-500"
                    onClick={onResume}
                >
                    Resume
                </button>
            ) : (
                <button
                    type="button"
                    className="text-sm text-blue-500"
                    onClick={onPause}
                >
                    Pause
                </button>
            )}
            <button
                type="button"
                className="text-sm text-red-500"
                onClick={onCancel}
            >
                Cancel
            </button>
        </div>
    );
}

export function UploadForm({
    fileInputRef,
    uploadProgress,
    uploading,
    isPaused,
    error,
    formattedProgress,
    onSubmit,
    onPause,
    onResume,
    onCancel,
}: UploadFormProps) {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex items-center">
                <input
                    type="file"
                    name="file"
                    ref={fileInputRef}
                    className="flex-grow"
                />
                <PrimaryButton>Upload</PrimaryButton>
            </div>

            {uploading && (
                <div className="mt-4">
                    <ProgressBar progress={uploadProgress} />

                    <div className="flex items-center justify-between mt-2">
                        <UploadControls
                            error={error}
                            isPaused={isPaused}
                            onSubmit={onSubmit}
                            onPause={onPause}
                            onResume={onResume}
                            onCancel={onCancel}
                        />
                        <div>{formattedProgress}%</div>
                    </div>

                    {error && (
                        <div className="mt-2 text-sm text-red-500">{error}</div>
                    )}
                </div>
            )}
        </form>
    );
}