<!DOCTYPE html>
<html>
<head>
    <title>You Have Issues to Review</title>
</head>
<body>
    <p>You have {{ $issueCount }} issues to review.</p>
    <p>Click <a href="{{ route('issue.index') }}">here</a> to view them.</p>
</body>
</html>
