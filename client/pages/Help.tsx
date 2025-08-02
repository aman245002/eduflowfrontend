// src/pages/Help.tsx
import AppLayout from "@/components/layout/AppLayout";

export default function Help() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-muted-foreground">
          Need help using EduFlow? Browse the FAQs, troubleshooting steps, or reach out to our support team.
        </p>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>

          <div className="space-y-4 text-muted-foreground">
            <div>
              <p className="font-medium">📌 How do I enroll in a course?</p>
              <p>Click on "Courses", choose your desired course, and hit the "Enroll Now" button. If the course is free, you’ll be enrolled immediately. For paid courses, complete the payment process.</p>
            </div>

            <div>
              <p className="font-medium">🔐 How do I reset my password?</p>
              <p>Go to the login page and click on "Forgot Password". Enter your registered email address and follow the link sent to your inbox to reset your password.</p>
            </div>

            <div>
              <p className="font-medium">📥 Can I download course materials?</p>
              <p>Yes, downloadable resources like PDFs and documents are available under each lesson. Videos are streamed and not downloadable to maintain copyright protection.</p>
            </div>

            <div>
              <p className="font-medium">👨‍🏫 How do I become an instructor?</p>
              <p>During registration, select "Instructor" as your role. Once logged in, you’ll have access to the Instructor Dashboard to create and manage your courses.</p>
            </div>

            <div>
              <p className="font-medium">📅 Where can I track my progress?</p>
              <p>Navigate to "My Learning" from the main menu. You’ll see progress bars and completion stats for all your enrolled courses.</p>
            </div>

            <div>
              <p className="font-medium">💳 What payment methods are supported?</p>
              <p>We accept all major debit/credit cards, UPI, and wallet payments via secure gateways like Razorpay and Stripe.</p>
            </div>

            <div>
              <p className="font-medium">🎓 Do I get a certificate after completing a course?</p>
              <p>Yes! Once you complete all lessons and pass the quizzes, a downloadable certificate will be available in the "Certificate" section.</p>
            </div>

            <div>
              <p className="font-medium">🔄 Can I switch from student to instructor later?</p>
              <p>Yes. Just go to your profile settings and update your role or contact support to assist with role migration.</p>
            </div>

            <div>
              <p className="font-medium">📧 I didn’t receive a verification or reset email. What do I do?</p>
              <p>Check your spam or promotions tab. If you still don’t find it, wait a few minutes or try resending.</p>
            </div>
          </div>
        </section>

        <p className="text-muted-foreground">
          Still need help? <a href="/contact" className="text-primary underline">Contact our support team</a>.
        </p>
      </div>
    </AppLayout>
  );
}
