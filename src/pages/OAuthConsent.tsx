import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
};

const oauthApi = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Thiếu authorization_id trong đường dẫn.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = `/auth?next=${encodeURIComponent(next)}`;
        return;
      }
      const { data, error: err } = await oauthApi().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (err) {
        setError(err.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error: err } = approve
      ? await oauthApi().approveAuthorization(authorizationId)
      : await oauthApi().denyAuthorization(authorizationId);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Máy chủ xác thực không trả về đường dẫn chuyển tiếp.");
      return;
    }
    window.location.href = target;
  };

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "Ứng dụng bên ngoài";

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-1 font-serif text-2xl font-bold gold-text">授权 · Cấp quyền</h1>

        {error ? (
          <>
            <p className="mt-4 text-sm text-destructive">Không thể xử lý yêu cầu cấp quyền: {error}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Yêu cầu có thể đã hết hạn. Hãy thử kết nối lại từ ứng dụng của bạn.
            </p>
          </>
        ) : !details ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang tải yêu cầu cấp quyền...
          </p>
        ) : (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              <strong className="text-foreground">{clientName}</strong> muốn kết nối với tài khoản HSK Hub của bạn.
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Tra cứu từ vựng, ngữ pháp, video luyện nghe và dữ liệu văn hóa.</li>
              <li>Đọc và thêm từ trong 生词本 của bạn.</li>
              <li>Xem kết quả các bài thi thử của bạn.</li>
            </ul>
            <div className="mt-6 flex gap-2">
              <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đồng ý
              </Button>
              <Button variant="outline" className="flex-1" disabled={busy} onClick={() => decide(false)}>
                Từ chối
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default OAuthConsent;
