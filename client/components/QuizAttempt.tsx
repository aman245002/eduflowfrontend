import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { URLS } from '@/config/urls';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, XCircle } from "lucide-react";
import axios from "axios";

import { BACKEND_URL } from '@/config/urls';

interface QuizAttemptProps {
  quiz?: {
    _id: string;
    title: string;
    description: string;
    passing_score?: number;
    max_attempts?: number;
    questions: {
      question_text: string;
      options: string[];
      correct_answer: number;
    }[];
  };
  lessonId: string;
}

export default function QuizAttempt({ quiz, lessonId }: QuizAttemptProps) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [passed, setPassed] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(quiz?.max_attempts || 10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (quiz?.questions?.length) {
      setAnswers(Array(quiz.questions.length).fill(-1));
    }
    if (quiz?.max_attempts) {
      setMaxAttempts(quiz.max_attempts);
    }
  }, [quiz]);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (!quiz?._id || answers.includes(-1)) {
      alert("⚠️ Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/quiz-attempts`,
        {
          quizId: quiz._id,
          lessonId,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const attempt = res.data.data;
      setScore(attempt.correctAnswers);
      setPercentage(attempt.percentage);
      setPassed(attempt.passed);
      setAttemptCount(attempt.attemptNumber);
      setSubmitted(true);
    } catch (err: any) {
      if (err?.response?.status === 403) {
        alert("⚠️ You have reached the maximum number of attempts.");
        setSubmitted(true);
      } else {
        console.error("Quiz submission failed:", err);
        alert("❌ An error occurred while submitting the quiz.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return (
      <div className="text-red-600 bg-red-100 border border-red-300 p-4 rounded mt-6">
        ⚠️ Quiz data is not available or invalid.
      </div>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl text-purple-700">{quiz.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {quiz.questions.map((q, i) => (
          <div key={i} className="space-y-2">
            <p className="font-medium">
              {i + 1}. {q.question_text}
            </p>
            <RadioGroup
              value={answers[i]?.toString()}
              onValueChange={(val) => handleSelect(i, parseInt(val))}
              disabled={submitted}
            >
              {q.options.map((opt, j) => (
                <div key={j} className="flex items-center space-x-2">
                  <RadioGroupItem value={j.toString()} id={`q${i}_opt${j}`} />
                  <label htmlFor={`q${i}_opt${j}`}>
                    {opt}
                    {submitted && j === q.correct_answer && (
                      <CheckCircle2 className="inline text-green-600 ml-2" size={18} />
                    )}
                    {submitted &&
                      j === answers[i] &&
                      j !== q.correct_answer && (
                        <XCircle className="inline text-red-600 ml-2" size={18} />
                      )}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        {!submitted ? (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <div className="space-y-2">
            <p className={`font-semibold ${passed ? "text-green-700" : "text-red-700"}`}>
              ✅ You scored {score} out of {quiz.questions.length} ({percentage}%)
            </p>
            {passed ? (
              <p className="text-blue-600">🎉 You passed the quiz!</p>
            ) : (
              <p className="text-red-600">❌ You did not pass. Try again if allowed.</p>
            )}
            <p className="text-sm text-muted-foreground">
              Attempt {attemptCount} / {maxAttempts}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
