<?php
namespace App\Http\Controllers;
use App\Models\IssueCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;



class IssueCategoryController extends Controller
{
    public function index()
    {
        $users = User::all();
        $issueCategories = IssueCategory::with('user')->get();
        // dd($issueCategories);
        return Inertia::render('issueCategories/index', [
            'categories' => $issueCategories,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255', 'user_id' => 'nullable|exists:users,id']);

        $issueCategory = IssueCategory::create([
            'name' => $request->name,
            'user_id' => $request->user_id,
        ]);

        return redirect()->back();
    }
    public function update(Request $request, IssueCategory $issueCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $issueCategory->update($validated);
    }
    public function destroy(IssueCategory $issueCategory)
    {
        $issueCategory->delete();
    }

    public function retrieveCategory()
    {
        $categories = IssueCategory::all();
        return response()->json($categories);
    }
}
