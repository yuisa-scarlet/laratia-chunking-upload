<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Pion\Laravel\ChunkUpload\Exceptions\UploadMissingFileException;
use Pion\Laravel\ChunkUpload\Handler\ContentRangeUploadHandler;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;

class FileController extends Controller
{
    public function store(Request $request)
    {
        // If you want to simulate an error, you can uncomment the line below
        // throw new Exception();
        
        $receiver = new FileReceiver(
            UploadedFile::fake()->createWithContent('file', $request->getContent()),
            $request,
            ContentRangeUploadHandler::class
        );

        // Check if the file is uploaded
        if ($receiver->isUploaded() == false) {
            throw new UploadMissingFileException();
        }

        $save = $receiver->receive();

        if ($save->isFinished()) {
            $file = $save->getFile();
            $this->storeFile($request, $file);
        }

        $save->handler();
    }

    protected function storeFile(Request $request, UploadedFile $file)
    {
        $request->user()->files()->create([
            'file_path' => $file->storeAs('uploads', Str::uuid(), 'public'),
        ]);
    }
}
