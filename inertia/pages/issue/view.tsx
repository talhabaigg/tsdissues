const ViewIssuePage = (id) => {
  const fetchIssue = async (id: string) => {
    try {
      const response = await fetch(route("issue.show", id));
      const data = await response.json(); // Parse the JSON response
      console.log("Data fetched:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div>
      <h1>Issue</h1>
      <p>View a single issue</p>
    </div>
  );
};
