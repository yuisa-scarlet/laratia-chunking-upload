type File = { id: number; file_path: string };

type FileListProps = {
    files: File[];
};

export function FileList({ files }: FileListProps) {
    if (files.length === 0) {
        return <p>No files uploaded yet.</p>;
    }

    return (
        <>
            {files.map((file) => (
                <div key={file.id} className="mb-4">
                    <p className="text-sm text-gray-600">
                        File Path: {file.file_path}
                    </p>
                </div>
            ))}
        </>
    );
}
