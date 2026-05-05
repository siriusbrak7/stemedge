import type { Subject, Topic } from '../data/mockData';

export interface ProgressRecord {
  score: number;
  updatedAt?: string;
}

export interface ResumeData {
  subjectId: string;
  topicId: string;
  subtopicIdx: number;
}

export interface DashboardTopicProgress {
  topicId: string;
  title: string;
  completedCount: number;
  totalCount: number;
  averageScore: number;
  subtopics: Array<{
    id: string;
    title: string;
    score: number;
  }>;
}

export interface DashboardSubjectProgress {
  subjectId: string;
  subjectName: string;
  completedCount: number;
  totalCount: number;
  averageScore: number;
  topics: DashboardTopicProgress[];
}

export function buildResumeData(subject: Subject, topic: Topic, progress: Record<string, ProgressRecord>): ResumeData {
  const nextUncompletedIdx = topic.subtopics.findIndex((sub) => progress[sub.id] === undefined);

  return {
    subjectId: subject.id,
    topicId: topic.id,
    subtopicIdx: nextUncompletedIdx >= 0 ? nextUncompletedIdx : topic.subtopics.length - 1,
  };
}

export function getCompletedCount(topic: Topic, progress: Record<string, ProgressRecord>): number {
  return topic.subtopics.filter((sub) => progress[sub.id] !== undefined).length;
}

export function calculateTopicAccuracy(topic: Topic, progress: Record<string, ProgressRecord>): number {
  const scores = topic.subtopics
    .map((sub) => progress[sub.id]?.score)
    .filter((score): score is number => score !== undefined);

  if (scores.length === 0) return 0;
  return scores.reduce((total, score) => total + score, 0) / scores.length;
}

export function calculateStreakDays(progress: Record<string, ProgressRecord>): number {
  const dateKeys = new Set(
    Object.values(progress)
      .map((record) => record.updatedAt?.slice(0, 10))
      .filter((value): value is string => Boolean(value)),
  );

  if (dateKeys.size === 0) return 0;

  const today = new Date();
  let streak = 0;

  for (;;) {
    const current = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - streak));
    const key = current.toISOString().slice(0, 10);
    if (!dateKeys.has(key)) break;
    streak += 1;
  }

  return streak;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function buildDashboardProgress(
  subjects: Subject[],
  progress: Record<string, ProgressRecord>,
): DashboardSubjectProgress[] {
  return subjects
    .map((subject) => {
      const topics = subject.topics
        .map((topic) => {
          const subtopics = topic.subtopics
            .map((subtopic) => {
              const record = progress[subtopic.id];
              if (!record) return null;

              return {
                id: subtopic.id,
                title: subtopic.title,
                score: record.score,
              };
            })
            .filter((subtopic): subtopic is NonNullable<typeof subtopic> => subtopic !== null);

          if (subtopics.length === 0) return null;

          return {
            topicId: topic.id,
            title: topic.title,
            completedCount: subtopics.length,
            totalCount: topic.subtopics.length,
            averageScore: subtopics.reduce((total, subtopic) => total + subtopic.score, 0) / subtopics.length,
            subtopics,
          };
        })
        .filter((topic): topic is NonNullable<typeof topic> => topic !== null);

      if (topics.length === 0) return null;

      const completedCount = topics.reduce((total, topic) => total + topic.completedCount, 0);
      const totalCount = subject.topics.reduce((total, topic) => total + topic.subtopics.length, 0);
      const averageScore = completedCount > 0
        ? topics.reduce((total, topic) => total + (topic.averageScore * topic.completedCount), 0) / completedCount
        : 0;

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        completedCount,
        totalCount,
        averageScore,
        topics,
      };
    })
    .filter((subject): subject is NonNullable<typeof subject> => subject !== null);
}
