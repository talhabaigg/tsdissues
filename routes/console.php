<?php

use App\Console\Commands\SendWeeklyIssueNotifications;
use Illuminate\Support\Facades\Artisan;

Schedule::command(SendWeeklyIssueNotifications::class)->weeklyOn(1, '09:00');
