// src/pages/PrivacyPolicy.tsx
import AppLayout from "@/components/layout/AppLayout";

export default function PrivacyPolicy() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          We value your privacy. This page explains how we collect, use, and protect your data when you use EduFlow.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>We collect user information for course access and personalization.</li>
          <li>Data is stored securely and is not shared with third parties without consent.</li>
          <li>Cookies are used to improve user experience and analytics.</li>
        </ul>
        <p className="text-muted-foreground">
          By using our platform, you consent to the terms of this Privacy Policy.
        </p>
      </div>
    </AppLayout>
  );
}
