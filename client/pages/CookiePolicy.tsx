// src/pages/CookiePolicy.tsx
import AppLayout from "@/components/layout/AppLayout";

export default function CookiePolicy() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Cookie Policy</h1>
        <p className="text-muted-foreground">
          This policy explains how we use cookies on EduFlow to enhance your experience.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Cookies store your preferences and session information.</li>
          <li>We use analytics cookies to understand platform usage.</li>
          <li>You can manage cookie settings in your browser.</li>
        </ul>
        <p className="text-muted-foreground">
          By continuing to browse the site, you accept our use of cookies.
        </p>
      </div>
    </AppLayout>
  );
}
