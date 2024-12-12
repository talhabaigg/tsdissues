<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

class Issue extends Model
{
    protected $fillable = [
        'type',
        'title',
        'description',
        'priority',
        'status',
        'assigned_to',
        'updated_by',

    ];

    protected static function booted()
    {
        static::creating(function ($issue) {
            // Set created_by when creating the issue
            if ($issue->type) {
                // Ensure $type is not null before calling getUserForIssueType
                $issue->assigned_to = $issue->getUserForIssueType($issue->type);
            } else {
                // Handle case when type is null, if needed
                $issue->assigned_to = null; // Or assign a default user ID, e.g., 1
            }
            $issue->updated_by = Auth::id() ?? 1;
            $issue->created_by = Auth::id() ?? 1; // Or assign a default user ID, e.g., 1
        });

        static::updating(function ($issue) {
            // Set updated_by when updating the issue
            $issue->updated_by = Auth::id();
        });
    }

    public function getUserForIssueType(string $type)
    {
        // Define a mapping of issue types to user IDs
        $userAssignment = [
            'product_quality' => 1, // User ID for Product Quality
            'it_hardware' => 1,     // User ID for IT Hardware
            'system' => 1,          // User ID for System issues
        ];

        // Return the corresponding user ID or null if not found
        return $userAssignment[$type] ?? null;
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function comments()
    {
        return $this->hasMany(IssueComment::class);
    }
}
