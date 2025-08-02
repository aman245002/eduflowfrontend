// src/pages/Enterprise.tsx
import AppLayout from "@/components/layout/AppLayout";

export default function Enterprise() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Enterprise Solutions</h1>
        <p className="text-muted-foreground">
          Equip your organization with the tools to train, upskill, and empower your workforce using EduFlow's enterprise solutions.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Why Choose EduFlow for Teams?</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Customized learning paths for your teams.</li>
            <li>Analytics and reporting to track performance.</li>
            <li>Dedicated support and integration options.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Request a Demo</h2>
          <p className="text-muted-foreground">
            Contact our team at <a href="mailto:enterprise@eduflow.com" className="text-primary underline">enterprise@eduflow.com</a> for personalized onboarding, plans, and platform walkthrough.
          </p>
        </section>
      </div>
    </AppLayout>
  );
}
