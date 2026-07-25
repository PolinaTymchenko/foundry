import * as clack from "@clack/prompts";
import type { Question } from "./types.js";

export class PromptCancelledError extends Error {
  constructor() {
    super("Prompt cancelled by user.");
    this.name = "PromptCancelledError";
  }
}

/**
 * Walks a question list in order, skipping anything already answered
 * (via `initial`) and anything whose `when` predicate fails against the
 * answers collected so far. Each remaining question's `default` is
 * resolved — static value or a function of prior answers — and used to
 * seed the prompt.
 */
export async function runPrompts<TAnswers extends Record<string, unknown>>(
  questions: Array<Question<TAnswers>>,
  initial: Partial<TAnswers> = {},
): Promise<TAnswers> {
  const answers: Partial<TAnswers> = { ...initial };

  for (const question of questions) {
    if (answers[question.name] !== undefined) {
      continue;
    }
    if (question.when && !question.when(answers)) {
      continue;
    }

    const defaultValue =
      typeof question.default === "function"
        ? (question.default as (a: Partial<TAnswers>) => unknown)(answers)
        : question.default;

    const result = await promptOne<TAnswers>(question, defaultValue);
    if (clack.isCancel(result)) {
      throw new PromptCancelledError();
    }
    answers[question.name] = result as TAnswers[typeof question.name];
  }

  return answers as TAnswers;
}

async function promptOne<TAnswers extends Record<string, unknown>>(
  question: Question<TAnswers>,
  defaultValue: unknown,
) {
  switch (question.type) {
    case "text":
      return clack.text({
        message: question.message,
        ...(typeof defaultValue === "string" ? { initialValue: defaultValue } : {}),
        ...(question.validate ? { validate: question.validate } : {}),
      });
    case "confirm":
      return clack.confirm({
        message: question.message,
        initialValue: defaultValue === undefined ? true : Boolean(defaultValue),
      });
    case "select":
      return clack.select({
        message: question.message,
        initialValue: defaultValue,
        options: (question.choices ?? []).map((choice) => ({
          value: choice.value,
          label: choice.label,
          ...(choice.hint ? { hint: choice.hint } : {}),
        })),
      });
    default: {
      const exhaustiveCheck: never = question.type;
      throw new Error(`Unsupported question type: ${String(exhaustiveCheck)}`);
    }
  }
}
