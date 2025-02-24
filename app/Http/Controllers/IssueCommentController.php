<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\IssueComment;
use Illuminate\Http\Request;

class IssueCommentController extends Controller
{
    public function store(Request $request): void
    {
        $validated = $request->validate([
            'issue_id' => 'required|exists:issues,id',
            'text' => 'required|string|max:500',
            'file' => 'nullable|file|mimes:jpg,png,pdf,mp4', // Adjust based on your file types
        ]);

        $comment = IssueComment::create([
            'issue_id' => $validated['issue_id'],
            'user_id' => auth()->id(), // Assuming the user is logged in
            'text' => $validated['text'],
            'file' => $request->file('file') ? $request->file('file')->store('comments', 'public') : null, // Adjust file storage path
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
