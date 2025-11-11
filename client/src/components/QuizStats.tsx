import "../App.css";

interface QuizStatsProps {
  databaseName?: string;
  questionsAsked: number;
  questionsAnswered: number;
  correctnessAverage: number;
}

function QuizStats({
  databaseName,
  questionsAsked,
  questionsAnswered,
  correctnessAverage,
}: QuizStatsProps) {
  return (
    <section className="quiz-stats">
      <div>
        <span className="label">Quiz:</span>{" "}
        <span className="value">{databaseName ?? "—"}</span>
      </div>
      <div>
        <span className="label">Questions asked:</span>{" "}
        <span className="value">{questionsAsked}</span>
      </div>
      <div>
        <span className="label">Questions answered:</span>{" "}
        <span className="value">{questionsAnswered}</span>
      </div>
      <div>
        <span className="label">Questions correct:</span>{" "}
        <span className="value">{correctnessAverage}%</span>
      </div>
    </section>
  );
}

export default QuizStats;

