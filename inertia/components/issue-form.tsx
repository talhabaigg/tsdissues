import { useForm } from "@inertiajs/react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { InputFile } from "./file-input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"; // Import from ShadCN
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox"; // Assuming Checkbox is from ShadCN
import { useState } from "react";

const IssueForm = () => {
  const { data, setData, post, processing, errors } = useForm({
    type: "",
    name: "",
    priority: "",
    description: "",
    attachments: [],
  });
  const issueTypes = [
    { value: "product_quality", label: "Product Quality" },
    { value: "it_hardware", label: "IT Hardware" },
    { value: "system", label: "System" },
  ];

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];
  // State to track whether the checkbox is checked
  const [isChecked, setIsChecked] = useState(false);

  const handleFileChange = (e) => {
    setData("attachments", Array.from(e.target.files));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!isChecked) {
      alert("You must confirm the checkbox before submitting.");
      return;
    }
    console.log(data);
    post(route("issue.store"));
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked); // Update the checkbox state
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Issue Type */}
      <div>
        <Label htmlFor="type">Issue Type</Label>
        <Select
          id="issue_type"
          value={data.type} // Controlled value bound to form state
          onValueChange={(value) => setData("type", value)} // Update state when value changes
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an issue type" />
          </SelectTrigger>
          <SelectContent>
            {/* Render options using the issueTypes array */}
            {issueTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && <div className="text-red-600">{errors.type}</div>}
      </div>

      {/* Issue Name */}
      <div>
        <Label htmlFor="name">Issue Title</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter issue title"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
          required
        />
        {errors.name && <div className="text-red-600">{errors.name}</div>}
      </div>

      {/* Priority */}
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          id="priority"
          value={data.priority}
          onValueChange={(value) => setData("priority", value)} // Controlled value
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {/* Render options using the priorityOptions array */}
            {priorityOptions.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.priority && (
          <div className="text-red-600">{errors.priority}</div>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
        />
        {errors.description && (
          <div className="text-red-600">{errors.description}</div>
        )}
      </div>

      {/* Evidence */}
      <div>
        <InputFile
          label="Upload file"
          id="attachments"
          onChange={handleFileChange}
        />
        {errors.attachments && (
          <div className="text-red-600">{errors.attachments}</div>
        )}
      </div>

      {/* Checkbox for confirmation */}
      <div className="flex items-center space-x-2">
        {/* Use a standard checkbox here */}
        <input
          type="checkbox"
          id="terms"
          checked={isChecked}
          onChange={handleCheckboxChange} // Handle the change
        />
        <Label htmlFor="terms">
          I confirm, this is not part of an individual customer credit request.
        </Label>
      </div>

      {/* Submit Button */}
      <div>
        <Button type="submit" disabled={processing || !isChecked}>
          {processing ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default IssueForm;
