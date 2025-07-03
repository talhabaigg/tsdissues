<?php

namespace App\Console\Commands;

use App\Models\Issue;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Mail;

class SendExecutiveWeeklyIssueSummary extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-executive-weekly-issue-summary';
    protected $description = 'Send weekly email notifications to all owners a summarized issues report.';
    /**
     * The console command description.
     *
     * @var string
     */


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::role('admin')->select('email')->get();
        foreach ($users as $user) {
            Log::info('users', $user->toArray());
        }
        $issues = Issue::where('status', '!=', 'resolved')
            ->orWhere('status', '!=', 'closed')
            ->get();
        $newIssues = $issues->where('created_at', '>=', now()->subWeek());
        $newIssueCount = $newIssues->count();
        $issues = $issues->groupBy('type')->map(function ($issuesOfType) {
            return [
                'pending' => $issuesOfType->where('status', 'pending')->count(),
                'active' => $issuesOfType->where('status', 'active')->count(),
            ];
        });
        $user = $users->where('email', 'automation@tankstreamdesign.com')->first();
        Mail::to($user->email)->send(new \App\Mail\ExecutiveWeeklyIssueSummary($issues, $newIssueCount, $newIssues));
        $this->info('Weekly issue notifications sent.');
    }
}
