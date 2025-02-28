<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class IssueReminder extends Mailable
{
    public $issueCount;
    public $issues;

    public function __construct($issueCount, $issues)
    {
        $this->issueCount = $issueCount;
        $this->issues = $issues;
    }

    public function build()
    {
        return $this->subject('You Have Issues to Review')
                    ->view('emails.issueReminder')
                    ->with([
                        'issueCount' => $this->issueCount,
                        'issues' => $this->issues,
                    ]);
    }
}
