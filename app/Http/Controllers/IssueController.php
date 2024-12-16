<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Issue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all issues, you can paginate or filter as needed
        $issues = Issue::with('user', 'assignee', 'creator', 'updater', 'comments.creator', 'activities.user') // Load related user if there's a relationship
            ->orderBy('created_at', 'desc')
            ->paginate(1000); // Adjust pagination as needed

        // Pass data to the Inertia view
        return Inertia::render('issue/index', [
            'issues' => $issues,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('issue/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'type' => 'required|string',
            'name' => 'required|string',
            'priority' => 'required',
            'description' => 'required|string',
            'file' => 'nullable|file|mimes:jpg,png,pdf,mp4|max:20480', // Adjust based on your file types

        ]);
        // dd($validated);
        if ($request->id) {
            $issue = Issue::findOrFail($request->id);  // Find the issue by ID
            $issue->update([  // Update the issue with new data
                'type' => $request->type,
                'title' => $request->name,
                'priority' => $request->priority,
                'description' => $request->description,
            ]);
            return redirect()->route('issue.index')->with('success', 'Issue updated successfully');
        } else {
            // If no ID, create a new issue
            $issue = Issue::create([
                'type' => $request->type,
                'title' => $request->name,
                'priority' => $request->priority,
                'status' => 'pending',  // Default status
                'description' => $request->description,
            ]);

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $originalFilename = $file->getClientOriginalName(); // Get the original file name
                $newFilename = 'issue_' . $issue->id . '_' . $originalFilename; // Add prefix
                $filePath = $file->storeAs('issues', $newFilename, 'public'); // Save file with new name
                // dd($filePath);
                // Update the issue with the file path
                $issue->update([
                    'file' => $filePath,
                ]);
            }
            if (!Auth::check()) {
                return redirect()->back()->with('success', 'Issue submitted successfully as a guest.');
            }
            return redirect()->route('issue.index')->with('success', 'Issue created successfully');
        }

    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $issue = Issue::with(
            'user',
            'assignee',
            'creator',
            'updater',
            'comments.creator',
            'activities.user'
        )->findOrFail($id);

        return response()->json($issue); // Return JSON response
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function updateStatus(Request $request, $id): void
    {
        $validated = $request->validate([
            'status' => 'nullable|string', // Validate status options
            'assigned_to' => 'nullable', // Validate if user exists
            'priority' => 'nullable',
            'title' => 'nullable',
        ]);

        //    dd($validated);
        $issue = Issue::findOrFail($id);
        $issue->update($validated);
        // $issue = Issue::findOrFail($id);
        // $issue->status = $validated['status'];
        // if ($validated['assigned_to']) {
        //     $issue->assigned_to = $validated['assigned_to'];
        // }

        // $issue->save();

        return;
    }
}
