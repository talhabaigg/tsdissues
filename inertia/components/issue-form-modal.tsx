import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import IssueForm from "~/components/issue-form";
import { Button } from "~/components/ui/button"; // Ensure Button is imported if used

const IssueFormModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Report new</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <IssueForm />
      </DialogContent>
    </Dialog>
  );
};

export default IssueFormModal;
