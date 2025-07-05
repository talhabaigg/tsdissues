export type RouteParams = {
  welcome: {};
  "api.latestComments": {};
  "password.confirm": {};
  dashboard: {};
  "verification.send": {};
  "password.request": {};
  "password.email": {};
  "issue.index": {};
  "issue.store": {};
  "issue-comments.store": {};
  "issue-comments.getCommentsByIssueId": {
    issueId: string;
  };
  "issue.create": {};
  "issue.show": {
    issue: string;
  };
  "issue.update": {
    issue: string;
  };
  "issue.destroy": {
    issue: string;
  };
  "issue.edit": {
    issue: string;
  };
  "issues.updateStatus": {
    id: number;
  };

  "issue-categories.index": {};
  "issue-categories.store": {};
  "issue-categories.update": {
    id: number;
  };
  "issue-categories.destroy": {
    id: number;
  };
  "issue-categories.retrieve": {};
  "users.index": {};
  "users.create": {};
  "users.store": {};
  "users.show": {
    user: string;
  };
  "users.getUsers": {};
  login: {};
  logout: {};
  "password.update": {};
  "profile.edit": {};
  "profile.update": {};
  "profile.destroy": {};
  register: {};
  "password.store": {};
  "password.reset": {
    token: string;
  };
  "verification.notice": {};
  "verification.verify": {
    id: string;
    hash: string;
  };
};
