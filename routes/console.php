<?php

use App\Console\Commands\SendWeeklyIssueNotifications;
use Illuminate\Support\Facades\Artisan;

Schedule::command(SendWeeklyIssueNotifications::class)->mondays('8:00')->timezone('Australia/Brisbane');
