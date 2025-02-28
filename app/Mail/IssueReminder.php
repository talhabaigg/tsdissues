<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class IssueReminder extends Mailable
{
    public $issueCount;

    public function __construct($issueCount)
    {
        $this->issueCount = $issueCount;
    }

    public function build()
    {
        return $this->subject('You Have Issues to Review')
                    ->view('emails.issueReminder')
                    ->with([
                        'issueCount' => $this->issueCount,
                    ]);
    }
}
