import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { mockApi, Submission } from "@/services/mockApi";
import { toast } from "sonner";

const SubmissionReview = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    mockApi.getSubmissions().then((items) => {
      const match = items.find((item) => item.id === id) || null;
      setSubmission(match);
    });
  }, [id]);

  const statusVariant = useMemo(() => {
    if (!submission) return "outline";
    if (submission.status === "Approved") return "default";
    if (submission.status === "Pending") return "secondary";
    if (submission.status === "Rejected") return "destructive";
    return "outline";
  }, [submission]);

  if (!submission) {
    return <div className="text-muted-foreground">Loading submission...</div>;
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Review Submission {submission.id}</h2>
        <p className="text-muted-foreground">Review officer data, add comments, and approve or reject.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Submission Details</CardTitle>
            <Badge variant={statusVariant}>{submission.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Officer</p>
                <p className="font-medium">{submission.officer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mahalla</p>
                <p className="font-medium">{submission.mahalla}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="font-medium">{submission.period}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">{submission.submittedAt}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Population</p>
                <p className="text-lg font-semibold">{submission.population}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Crimes</p>
                <p className="text-lg font-semibold">{submission.crimes}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Preventive</p>
                <p className="text-lg font-semibold">{submission.preventive}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Documents</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {submission.documents.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reviewer comments</label>
              <textarea className="min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Add comments" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => toast.success("Submission approved")}>Approve</Button>
              <Button variant="destructive" onClick={() => toast.error("Submission rejected")}>Reject</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-muted-foreground">
              {submission.history.map((item) => (
                <li key={item.date} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium text-foreground">{item.event}</p>
                    <p className="text-xs">{item.date}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmissionReview;
