<!DOCTYPE html>
<html>
<head>
    <title>You Have Issues to Review</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<body>
    
    <p>You have {{ $issueCount }} company issues to review:</p>

    <table>
        <thead>
            <tr>
                <th>Issue Name</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach($issues as $issue)
                <tr>
                    <td>{{ $issue->title }}</td>
                    <td>{{ $issue->status }}</td>
                    <td><a href="{{ route('issue.show', $issue->id) }}">View</a></td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
