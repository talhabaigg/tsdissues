<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ExecutiveWeeklyIssueSummary extends Mailable
{
    use Queueable, SerializesModels;

    public $issues;
    public $newIssueCount;
    public $newIssues;
    /**
     * Create a new message instance.
     */
    public function __construct($issues, $newIssueCount, $newIssues)
    {
        $this->issues = $issues;
        $this->newIssueCount = $newIssueCount;
        $this->newIssues = $newIssues;
    }

    /**
     * Get the message envelope.
     */
    public function build()
    {
        return $this->subject("TSD Issues Executive Summary - " . date('d-m-Y'))
            ->view('mail.executive-weekly-issue-summary')
            ->with([

                'issues' => $this->issues,
                'newIssueCount' => $this->newIssueCount,
                'newIssues' => $this->newIssues,

            ]);
    }
}
