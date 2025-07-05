import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import IssueForm from "~/components/issue-form";
import { Button } from "~/components/ui/button"; // Ensure Button is imported if used
import IssueFormQR from "~/components/issue-form-guest-qr";
import { DialogTitle } from "@radix-ui/react-dialog";
const IssueFormModal = () => {
  return (
    <Dialog>
      <DialogTitle className="sr-only">Report new issue</DialogTitle>
      <DialogTrigger asChild>
        <Button variant="outline">Report new issue</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <IssueForm loggedIn={true} issue={null} />
      </DialogContent>
    </Dialog>
  );
};

export default IssueFormModal;
