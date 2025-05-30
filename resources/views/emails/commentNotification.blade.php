<!DOCTYPE html>
<html>

<head>
    <title>New comment - {{ $comment->issue->title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            padding: 20px;
            color: #333;
        }

        .container {
            max-width: 600px;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: auto;
        }

        h2 {
            color: #333;
            text-align: center;
        }

        p {
            font-size: 16px;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
        }

        th {
            background-color: #008080;
            color: #fff;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .btn {
            display: inline-block;
            padding: 8px 12px;
            background-color: #008080;
            color: #fff !important;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
        }

        .btn:hover {
            background-color: #2f73f0;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>New Comment on Issue - {{ $comment->issue->title }}</h2>

        <p>Hello,</p>
        <p>{{ $comment->creator->name }} has commented on the issue titled
            "<strong>{{ $comment->issue->title }}</strong>".</p>
        <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
            <div
                style="min-width: 48px; min-height: 48px; width: 48px; height: 48px; border-radius: 50%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                <!-- Simple dummy profile icon (SVG) -->
                <img src="{{ asset('email-icons/user.png') }}" alt="User Icon" width="24" height="24"
                    style="display: block;" />
            </div>
            <div>
                <strong>{{ $comment->creator->name }}</strong>
                <span style="color: #888; font-size: 13px; margin-left: 8px;">
                    {{ $comment->created_at->format('F j, Y, g:i a') }}
                </span>
                <blockquote
                    style="margin: 8px 0 0 0; padding-left: 12px; border-left: 3px solid #008080; background: #f9f9f9;">
                    <p style="margin: 0;">{{ $comment->text }}</p>
                </blockquote>
            </div>
        </div>
        <p>You can view the issue <a href="{{ route('issue.show', $comment->issue->id) }}">here</a>.</p>
    </div>

</body>

</html>