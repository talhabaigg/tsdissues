<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class IssueReminder extends Mailable
{
    public $issueCount;
    public $issues;
    public $newIssueCount;
    public $newIssues;

    public function __construct($issueCount, $issues, $newIssueCount, $newIssues)
    {
        $this->issueCount = $issueCount;
        $this->issues = $issues;
        $this->newIssueCount = $newIssueCount;
        $this->newIssues = $newIssues;
    }

    public function build()
    {
        return $this->subject("TSD Issues Summary - " . date('d-m-Y'))
                    ->view('emails.issueReminder')
                    ->with([
                        'issueCount' => $this->issueCount,
                        'issues' => $this->issues,
                        'newIssueCount' => $this->newIssueCount,
                        'newIssues' => $this->newIssues
                    ]);
    }
}
