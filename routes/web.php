<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\IssueCommentController;
use App\Models\IssueActivity;

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
    return Inertia::render('dashboard')->with('existingActivities', $existingActivities);
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


require __DIR__ . '/auth.php';
