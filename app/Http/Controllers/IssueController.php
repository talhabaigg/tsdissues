<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Issue;
use Illuminate\Http\Request;

class IssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all issues, you can paginate or filter as needed
        $issues = Issue::with('user', 'assignee', 'creator', 'updater', 'comments.creator') // Load related user if there's a relationship
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
           
        ]);
    //    dd($validated);
        $issue = Issue::create([
            'type' => $request->type,
            'title' => $request->name,
            'priority' => $request->priority,
            'status' => 'open',
            'description' => $request->description,
           
          
        ]);
        return redirect()->route('issue.index')->with('success', 'Issue created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
