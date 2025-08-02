import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Flag,
  BookOpen,
  RotateCcw,
} from "lucide-react";

const quizData = {
  id: 1,
  title: "React Hooks Fundamentals Quiz",
  description:
    "Test your understanding of React Hooks including useState, useEffect, and custom hooks.",
  lessonId: 8,
  lessonTitle: "useState Hook",
  courseTitle: "Complete React Developer Course",
  timeLimit: 1800, // 30 minutes in seconds
  passingScore: 70,
  maxAttempts: 3,
  currentAttempt: 1,
  questions: [
    {
      id: 1,
      type: "multiple-choice",
      question:
        "What is the correct way to initialize state with useState hook?",
      options: [
        "const [count, setCount] = useState(0);",
        "const [count, setCount] = useState();",
        "const count = useState(0);",
        "const setCount = useState(0);",
      ],
      correctAnswer: 0,
      explanation:
        "useState returns an array with two elements: the current state value and a setter function. Array destructuring is used to assign them to variables.",
      points: 10,
    },
    {
      id: 2,
      type: "multiple-choice",
      question:
        "Which of the following is true about the useState setter function?",
      options: [
        "It directly mutates the state",
        "It triggers a re-render of the component",
        "It can only be called once",
        "It returns the new state value",
      ],
      correctAnswer: 1,
      explanation:
        "The setter function from useState triggers a re-render of the component with the new state value.",
      points: 10,
    },
    {
      id: 3,
      type: "multiple-select",
      question:
        "Which of the following are valid ways to update state with useState? (Select all that apply)",
      options: [
        "setCount(count + 1)",
        "setCount(prevCount => prevCount + 1)",
        "setCount((prev) => prev + 1)",
        "count = count + 1",
      ],
      correctAnswers: [0, 1, 2],
      explanation:
        "You can update state by passing a new value or a function that receives the previous state. Direct mutation is not allowed.",
      points: 15,
    },
    {
      id: 4,
      type: "true-false",
      question:
        "React hooks can only be called at the top level of React functions.",
      correctAnswer: true,
      explanation:
        "Hooks must be called at the top level of React functions, not inside loops, conditions, or nested functions.",
      points: 10,
    },
    {
      id: 5,
      type: "multiple-choice",
      question:
        "What happens if you call useState with an expensive computation?",
      options: [
        "The computation runs on every render",
        "React automatically optimizes it",
        "You should pass a function instead",
        "It causes an error",
      ],
      correctAnswer: 2,
      explanation:
        "If the initial state is the result of an expensive computation, you should pass a function to useState instead of calling the computation directly.",
      points: 15,
    },
  ],
};

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestion(index);
  };

  const toggleFlag = (questionId: number) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setIsReviewMode(true);
    // Calculate score and show results
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    quizData.questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];

      if (
        question.type === "multiple-choice" ||
        question.type === "true-false"
      ) {
        if (userAnswer === question.correctAnswer) {
          earnedPoints += question.points;
        }
      } else if (question.type === "multiple-select") {
        const correctAnswers = question.correctAnswers || [];
        const userAnswers = userAnswer || [];
        if (
          correctAnswers.length === userAnswers.length &&
          correctAnswers.every((ans: number) => userAnswers.includes(ans))
        ) {
          earnedPoints += question.points;
        }
      }
    });

    return {
      earnedPoints,
      totalPoints,
      percentage: Math.round((earnedPoints / totalPoints) * 100),
    };
  };

  const score = calculateScore();
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;
  const currentQ = quizData.questions[currentQuestion];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {score.percentage >= quizData.passingScore ? (
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">
                {score.percentage >= quizData.passingScore
                  ? "Congratulations!"
                  : "Quiz Complete"}
              </CardTitle>
              <p className="text-muted-foreground">
                {score.percentage >= quizData.passingScore
                  ? "You passed the quiz!"
                  : "You didn't reach the passing score this time."}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {score.percentage}%
                  </div>
                  <p className="text-sm text-muted-foreground">Your Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">
                    {score.earnedPoints}/{score.totalPoints}
                  </div>
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">
                    {quizData.passingScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">Passing Score</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Your Answers</h3>
                {quizData.questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  let isCorrect = false;

                  if (
                    question.type === "multiple-choice" ||
                    question.type === "true-false"
                  ) {
                    isCorrect = userAnswer === question.correctAnswer;
                  } else if (question.type === "multiple-select") {
                    const correctAnswers = question.correctAnswers || [];
                    const userAnswers = userAnswer || [];
                    isCorrect =
                      correctAnswers.length === userAnswers.length &&
                      correctAnswers.every((ans: number) =>
                        userAnswers.includes(ans),
                      );
                  }

                  return (
                    <Card
                      key={question.id}
                      className={`border-l-4 ${
                        isCorrect
                          ? "border-l-success"
                          : userAnswer !== undefined
                            ? "border-l-destructive"
                            : "border-l-warning"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : userAnswer !== undefined ? (
                              <XCircle className="h-5 w-5 text-destructive" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-warning" />
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <p className="font-medium">
                              {index + 1}. {question.question}
                            </p>
                            {question.type === "multiple-choice" && (
                              <div className="space-y-1">
                                {question.options?.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`p-2 rounded text-sm ${
                                      optIndex === question.correctAnswer
                                        ? "bg-success/10 text-success"
                                        : userAnswer === optIndex &&
                                            userAnswer !==
                                              question.correctAnswer
                                          ? "bg-destructive/10 text-destructive"
                                          : ""
                                    }`}
                                  >
                                    {option}
                                    {optIndex === question.correctAnswer &&
                                      " ✓"}
                                    {userAnswer === optIndex &&
                                      userAnswer !== question.correctAnswer &&
                                      " ✗"}
                                  </div>
                                ))}
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground">
                              <strong>Explanation:</strong>{" "}
                              {question.explanation}
                            </p>
                          </div>
                          <Badge variant="outline">{question.points} pts</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-center space-x-4">
                {score.percentage < quizData.passingScore &&
                  quizData.currentAttempt < quizData.maxAttempts && (
                    <Button>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Retake Quiz
                    </Button>
                  )}
                <Button variant="outline" onClick={() => navigate(-1)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{quizData.title}</h1>
              <p className="text-sm text-muted-foreground">
                {quizData.courseTitle} • {quizData.lessonTitle}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={timeLeft < 300 ? "text-destructive" : ""}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Badge variant="outline">
                Attempt {quizData.currentAttempt} of {quizData.maxAttempts}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {answeredQuestions} of {quizData.questions.length} answered
                </div>
                <Progress
                  value={(answeredQuestions / quizData.questions.length) * 100}
                />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {quizData.questions.map((question, index) => {
                    const isAnswered = answers[question.id] !== undefined;
                    const isCurrent = index === currentQuestion;
                    const isFlagged = flaggedQuestions.has(question.id);

                    return (
                      <button
                        key={question.id}
                        onClick={() => handleQuestionJump(index)}
                        className={`relative w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          isCurrent
                            ? "bg-primary text-primary-foreground"
                            : isAnswered
                              ? "bg-success/10 text-success border border-success/20"
                              : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {index + 1}
                        {isFlagged && (
                          <Flag className="absolute -top-1 -right-1 h-3 w-3 text-warning fill-warning" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-success" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-muted" />
                    <span>Not answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flag className="h-3 w-3 text-warning" />
                    <span>Flagged</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline">
                      Question {currentQuestion + 1} of{" "}
                      {quizData.questions.length}
                    </Badge>
                    <Badge variant="outline" className="ml-2">
                      {currentQ.points} points
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFlag(currentQ.id)}
                    className={
                      flaggedQuestions.has(currentQ.id) ? "text-warning" : ""
                    }
                  >
                    <Flag className="h-4 w-4" />
                    {flaggedQuestions.has(currentQ.id) ? "Unflag" : "Flag"}
                  </Button>
                </div>
                <Progress value={progress} className="mt-4" />
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">
                    {currentQ.question}
                  </h2>

                  {currentQ.type === "multiple-choice" && (
                    <RadioGroup
                      value={answers[currentQ.id]?.toString()}
                      onValueChange={(value) =>
                        handleAnswerChange(currentQ.id, parseInt(value))
                      }
                    >
                      <div className="space-y-3">
                        {currentQ.options?.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                          >
                            <RadioGroupItem
                              value={index.toString()}
                              id={`option-${index}`}
                            />
                            <Label
                              htmlFor={`option-${index}`}
                              className="flex-1 cursor-pointer"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}

                  {currentQ.type === "multiple-select" && (
                    <div className="space-y-3">
                      {currentQ.options?.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`option-${index}`}
                            checked={
                              answers[currentQ.id]?.includes(index) || false
                            }
                            onCheckedChange={(checked) => {
                              const currentAnswers = answers[currentQ.id] || [];
                              if (checked) {
                                handleAnswerChange(currentQ.id, [
                                  ...currentAnswers,
                                  index,
                                ]);
                              } else {
                                handleAnswerChange(
                                  currentQ.id,
                                  currentAnswers.filter(
                                    (ans: number) => ans !== index,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentQ.type === "true-false" && (
                    <RadioGroup
                      value={answers[currentQ.id]?.toString()}
                      onValueChange={(value) =>
                        handleAnswerChange(currentQ.id, value === "true")
                      }
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                          <RadioGroupItem value="true" id="true" />
                          <Label
                            htmlFor="true"
                            className="flex-1 cursor-pointer"
                          >
                            True
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                          <RadioGroupItem value="false" id="false" />
                          <Label
                            htmlFor="false"
                            className="flex-1 cursor-pointer"
                          >
                            False
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of{" "}
                      {quizData.questions.length}
                    </p>
                  </div>

                  {currentQuestion === quizData.questions.length - 1 ? (
                    <Button onClick={() => setShowConfirmSubmit(true)}>
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirm Submit Dialog */}
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quiz?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to submit your quiz? You have answered{" "}
              {answeredQuestions} out of {quizData.questions.length} questions.
            </p>
            {answeredQuestions < quizData.questions.length && (
              <p className="text-warning text-sm">
                ⚠️ You have {quizData.questions.length - answeredQuestions}{" "}
                unanswered questions. They will be marked as incorrect.
              </p>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmSubmit(false)}
              >
                Review More
              </Button>
              <Button onClick={handleSubmit}>Submit Quiz</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
