<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use App\Traits\IssueLogActivity;

class Issue extends Model
{
    use IssueLogActivity;
    protected $fillable = [
        'type',
        'title',
        'description',
        'file',
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
            $issue_id = $issue->id;

        });
        static::created(function ($issue) {
            // Now that the issue is created, log the activity
            $issue->addActivity('created', null, $issue->toJson(), $issue->id);
        });
        static::updating(function ($issue) {
            // Set updated_by when updating the issue
            $issue->updated_by = Auth::id();
            $original = $issue->getOriginal(); // Get the original (old) values
            $changes = $issue->getDirty(); // Get the changed (new) values

            foreach ($changes as $field => $newValue) {
                $oldValue = $original[$field] ?? null;  // Get the old value or null if not set
                // Only log activity if the field has changed
                if ($oldValue !== $newValue) {
                    if ($field === 'assigned_to') {
                        // Get the user object based on the ID
                        $newUser = \App\Models\User::find($newValue);
                        $oldUser = \App\Models\User::find($oldValue);
                        $newValue = $newUser ? $newUser->name : 'Unknown User';
                        $oldValue = $oldUser ? $oldUser->name : 'Unknown User';
                    }
                    $issue->addActivity("changed $field", $oldValue, $newValue, $issue->id);
                }
            }
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

    public function activities()
    {
        return $this->hasMany(IssueActivity::class);  // Assuming your activity model is named IssueActivity
    }
}
