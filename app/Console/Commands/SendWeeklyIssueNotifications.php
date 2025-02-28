<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Issue;
use Illuminate\Support\Facades\Mail;
use App\Mail\IssueReminder;

class SendWeeklyIssueNotifications extends Command
{
    protected $signature = 'send:weekly-issue-notifications';
    protected $description = 'Send weekly email notifications to issue owners about pending issues.';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $owners = User::has('issues')->get();

        foreach ($owners as $owner) {
            $issues = $owner->issues()->where('status', '!=', 'resolved')->get();
            $issueCount = $issues->count();

            if ($issueCount > 0) {

                Mail::to($owner->email)->send(new IssueReminder($issueCount, $issues));
            }
        }

        $this->info('Weekly issue notifications sent.');
    }
    
}
