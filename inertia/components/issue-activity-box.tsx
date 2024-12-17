import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import SmallAvatar from "~/components/user-avatar-small";
import ColoredBadge from "~/components/colored-badge";

interface IssueActivityBoxProps {
  issueId?: number;
  existingActivities: any[];
}

const isJson = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};

const formatJson = (json: string) => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2); // pretty print with 2 spaces of indentation
  } catch (e) {
    return json; // If it's not valid JSON, just return the raw value
  }
};

const IssueActivityBox: React.FC<IssueActivityBoxProps> = ({
  issueId,
  existingActivities,
}) => {
  const [activity, setActivity] = useState(existingActivities.reverse());

  return (
    <div className="space-y-2  ">
      {activity.length === 0 ? (
        <p className="text-center text-gray-500">No activity found.</p>
      ) : (
        activity.map((act, index) => (
          <div
            key={index}
            className="flex flex-wrap space-x-2 items-center sm:space-x-4 border p-2 rounded  my-2"
          >
            <SmallAvatar userFullName={act.user.name} />
            <span className="mx-1 font-semibold">{act.action}</span>
            <div className="flex ">
              {act.action !== "created" && (
                <>
                  {act.old_value.length <= 10 ? (
                    <ColoredBadge value={act.old_value} />
                  ) : (
                    <p className="text-sm text-gray-500">
                      Value is too long to display
                    </p>
                  )}
                </>
              )}

              {act.action === "created" ? "" : <ArrowRight />}

              {!isJson(act.new_value) ? (
                <>
                  {act.new_value.length <= 10 ? (
                    <ColoredBadge value={act.new_value} />
                  ) : (
                    <p className="wrap text-sm text-gray-500">
                      {act.new_value}
                    </p>
                  )}
                </>
              ) : (
                <pre className="p-1 rounded-lg text-wrap text-xs ">
                  {formatJson(act.new_value)}
                </pre>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default IssueActivityBox;
