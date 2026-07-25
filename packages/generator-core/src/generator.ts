import { runPrompts } from "./prompt.js";
import { assertEmptyOrMissing, renderTemplate } from "./render.js";
import type { GeneratorDefinition } from "./types.js";

export interface RunGeneratorOptions<TAnswers extends Record<string, unknown>> {
  definition: GeneratorDefinition<TAnswers>;
  /**
   * Where to render the template. A function is useful when the target
   * directory itself depends on an answer (e.g. the project name) that
   * isn't known until the prompt flow completes.
   */
  targetDir: string | ((answers: TAnswers) => string);
  /** Answers already known (e.g. from CLI args) — skipped in the prompt flow. */
  initialAnswers?: Partial<TAnswers>;
}

export interface RunGeneratorResult<TAnswers extends Record<string, unknown>> {
  answers: TAnswers;
  targetDir: string;
  filesWritten: string[];
}

/**
 * The single orchestration entry point every generator — the project
 * generator today, an artifact generator later — runs through: prompt,
 * resolve the target directory, guard against overwriting existing work,
 * render the template, run lifecycle hooks around the render.
 */
export async function runGenerator<TAnswers extends Record<string, unknown>>({
  definition,
  targetDir,
  initialAnswers,
}: RunGeneratorOptions<TAnswers>): Promise<RunGeneratorResult<TAnswers>> {
  const answers = await runPrompts(definition.questions, initialAnswers);
  const resolvedTargetDir = typeof targetDir === "function" ? targetDir(answers) : targetDir;
  const ctx = { answers, targetDir: resolvedTargetDir };

  await assertEmptyOrMissing(resolvedTargetDir);
  await definition.hooks?.beforeRender?.(ctx);

  const filesWritten = await renderTemplate({
    templateRoot: definition.template.root,
    targetDir: resolvedTargetDir,
    variables: toVariableMap(answers),
  });

  await definition.hooks?.afterRender?.(ctx);

  return { answers, targetDir: resolvedTargetDir, filesWritten };
}

function toVariableMap(answers: Record<string, unknown>): Record<string, string> {
  const variables: Record<string, string> = {};
  for (const [key, value] of Object.entries(answers)) {
    variables[key] = String(value);
  }
  return variables;
}
