<div>
    <!-- Waste no more time arguing what a good man should be, be one. - Marcus Aurelius -->
</div>
<!DOCTYPE html>
<html>

<head>
    <title>You Have Issues to Review</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            padding: 20px;
            color: #333;
        }

        .container {
            max-width: 500px;
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
        <h2>Weekly Issues Summary - {{ date('d/m/Y') }}</h2>


        @if (count($issues) > 0)

            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Issue type</th>
                        <th>Active</th>
                        <th>Pending</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($issues as $type => $counts)
                        <tr>
                            <td>{{ strtoupper(str_replace('_', ' ', $type)) }}</td>
                            <td>{{ $counts['active'] ?? 0 }}</td>
                            <td>{{ $counts['pending'] ?? 0 }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
        <br>
        @if ($newIssueCount > 0)
            <p>{{ $newIssueCount }} New issue(s) reported last week:</p>
            <table>
                <thead>
                    <tr>
                        <th>Issue Name</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($newIssues as $issue)
                        <tr>
                            <td>{{ $issue->title }}</td>
                            <td>{{ $issue->status }}</td>
                            <td><a href="{{ route('issue.show', $issue->id) }}" class="btn">View</a></td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
        <br>


        <a href="{{ route('issue.index') }}" class="btn">Go to Issues log</a>
    </div>

</body>

</html>
