<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\IssueComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class IssueCommentController extends Controller
{
    public function store(Request $request): void
    {
        $validated = $request->validate([
            'issue_id' => 'required|exists:issues,id',
            'text' => 'required|string|max:50',
            'file' => 'nullable|file|mimes:jpg,png,pdf,mp4|max:20480', // Adjust based on your file types
        ]);

        $filePath = null;

        if ($request->hasFile('file')) {
            // Generate a unique filename using UUID
            $uuid = Str::uuid()->toString();
            $extension = $request->file('file')->getClientOriginalExtension();
            $newFilename = $uuid . '.' . $extension;

            // Store the file in S3 with public visibility
            $filePath = Storage::disk('s3')->putFileAs('comments', $request->file('file'), $newFilename, 'public');
        }

        // Create the comment with the file path (if any)
        $comment = IssueComment::create([
            'issue_id' => $validated['issue_id'],
            'user_id' => auth()->id(), // Assuming the user is logged in
            'text' => $validated['text'],
            'file' => $filePath ? Storage::disk('s3')->url('comments/' . $newFilename) : null,
        ]);

        return;
    }

    public function latest()
    {
        $comments = IssueComment::with(['creator', 'issue'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        // dd($comments);

        return response()->json($comments);
    }

}
