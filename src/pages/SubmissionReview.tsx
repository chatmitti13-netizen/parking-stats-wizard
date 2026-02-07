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
    if (submission.status === "Tasdiqlangan") return "default";
    if (submission.status === "Ko'rib chiqilmoqda") return "secondary";
    if (submission.status === "Rad etilgan") return "destructive";
    return "outline";
  }, [submission]);

  if (!submission) {
    return <div className="text-muted-foreground">Topshiriq yuklanmoqda...</div>;
  }

  const handleStatusUpdate = (status: Submission["status"], message: string) => {
    const payload: Submission = {
      ...submission,
      status,
      history: [
        ...submission.history,
        { date: new Date().toISOString().slice(0, 10), event: message },
      ],
    };
    mockApi.saveSubmission(payload).then(() => {
      setSubmission(payload);
    });
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Topshiriqni ko'rib chiqish {submission.id}</h2>
        <p className="text-muted-foreground">Xodim ma'lumotlarini ko'rib chiqing, izoh qo'shing va tasdiqlang yoki rad eting.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Topshiriq tafsilotlari</CardTitle>
            <Badge variant={statusVariant}>{submission.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Xodim</p>
                <p className="font-medium">{submission.officer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mahalla</p>
                <p className="font-medium">{submission.mahalla}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Davr</p>
                <p className="font-medium">{submission.period}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Yuborilgan sana</p>
                <p className="font-medium">{submission.submittedAt}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Aholi soni</p>
                <p className="text-lg font-semibold">{submission.population}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Jinoyatlar</p>
                <p className="text-lg font-semibold">{submission.crimes}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Profilaktika</p>
                <p className="text-lg font-semibold">{submission.preventive}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Hujjatlar</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {submission.documents.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ko'rib chiquvchi izohi</label>
              <textarea className="min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Izoh kiriting" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  handleStatusUpdate("Tasdiqlangan", "Administrator tomonidan tasdiqlandi");
                  toast.success("Topshiriq tasdiqlandi");
                }}
              >
                Tasdiqlash
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleStatusUpdate("Rad etilgan", "Administrator tomonidan rad etildi");
                  toast.error("Topshiriq rad etildi");
                }}
              >
                Rad etish
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Tarix</CardTitle>
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
