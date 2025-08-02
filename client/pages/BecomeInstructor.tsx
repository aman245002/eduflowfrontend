// src/pages/BecomeInstructor.tsx
import AppLayout from "@/components/layout/AppLayout";

export default function BecomeInstructor() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Become an Instructor</h1>
        <p className="text-muted-foreground">
          Share your knowledge with thousands of learners. EduFlow empowers you to build, publish, and monetize high-quality courses.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Why Teach on EduFlow?</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Earn passive income from your courses.</li>
            <li>Reach a global audience of motivated students.</li>
            <li>Access tools to build, track, and improve your content.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How to Get Started</h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>Create an instructor account (select "instructor" during signup).</li>
            <li>Set up your profile and expertise areas.</li>
            <li>Start creating your course using our content builder.</li>
          </ol>
        </section>
      </div>
    </AppLayout>
  );
}
