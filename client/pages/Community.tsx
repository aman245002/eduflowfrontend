// src/pages/Community.tsx
import AppLayout from "@/components/layout/AppLayout";

export default function Community() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Connect with fellow learners, instructors, and experts across our growing EduFlow ecosystem.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Join the Conversation</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><a href="https://discord.gg/eduflow" target="_blank" className="text-primary underline">EduFlow Discord</a></li>
            <li><a href="https://forum.eduflow.com" target="_blank" className="text-primary underline">Community Forum</a></li>
            <li><a href="https://www.linkedin.com/company/eduflow" target="_blank" className="text-primary underline">LinkedIn Group</a></li>
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
