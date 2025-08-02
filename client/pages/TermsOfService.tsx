// src/pages/TermsOfService.tsx
import AppLayout from "@/components/layout/AppLayout";

export default function TermsOfService() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">
          These terms govern your use of the EduFlow platform. Please read them carefully.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>You must be 13 years or older to use our services.</li>
          <li>You agree not to misuse the platform or disrupt the services.</li>
          <li>All course content is protected by copyright and must not be redistributed.</li>
        </ul>
        <p className="text-muted-foreground">
          Continued use of EduFlow indicates your agreement to these terms.
        </p>
      </div>
    </AppLayout>
  );
}
