<?php

use App\Models\User;
use Inertia\Inertia;
use App\Models\Issue;
use App\Models\IssueActivity;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\UserController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\IssueCommentController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    $existingActivities = IssueActivity::with(['issue', 'user'])
        ->latest()
        ->take(15)
        ->get();
    $existingAssignees = User::withCount('issues')
        ->orderByDesc('issues_count') // Sort users by issue count in descending order
        ->take(5) // Limit to top 5 users
        ->get();
    $existingIssuesByDepartment = Issue::all()->countBy('type')->toArray();

    return Inertia::render('dashboard', [
        'existingActivities' => $existingActivities,
        'existingAssignees' => $existingAssignees,
        'existingIssuesByDepartment' => $existingIssuesByDepartment,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::resource('issue', IssueController::class);
// web.php
Route::post('/issues/{id}/update-status', [IssueController::class, 'updateStatus'])->name('issues.updateStatus');
Route::post('/issue-comments', [IssueCommentController::class, 'store'])->name('issue-comments.store');
Route::get('/issue-comments/{issueId}', [IssueCommentController::class, 'getCommentsByIssueId'])->name('issue-comments.getCommentsByIssueId');
Route::get('/api/latest-comments', [IssueCommentController::class, 'latest'])->name('api.latestComments');

Route::get('/get-users', [UserController::class, 'getUsers'])->name('users.getUsers');

require __DIR__ . '/auth.php';
