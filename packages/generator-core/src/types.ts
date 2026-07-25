export type QuestionType = "text" | "confirm" | "select";

export interface SelectChoice {
  label: string;
  value: string;
  hint?: string;
}

export interface Question<TAnswers extends Record<string, unknown> = Record<string, unknown>> {
  /** Key this question's answer is stored under. */
  name: keyof TAnswers & string;
  /** Prompt copy shown to the user. */
  message: string;
  type: QuestionType;
  /** Choices for "select" questions. */
  choices?: SelectChoice[];
  /** Static default, or computed from answers collected so far. */
  default?: unknown | ((answers: Partial<TAnswers>) => unknown);
  /**
   * Only ask this question if the predicate returns true. Lets a generator
   * skip questions that don't apply to the current answers — the mechanism
   * an archetype-aware artifact generator will lean on later.
   */
  when?: (answers: Partial<TAnswers>) => boolean;
  /** Validate raw text input; return an error string, or undefined if valid. */
  validate?: (value: string) => string | undefined;
}

export interface TemplateSource {
  /** Absolute path to read template files from. */
  root: string;
}

export interface GeneratorContext<
  TAnswers extends Record<string, unknown> = Record<string, unknown>,
> {
  answers: TAnswers;
  targetDir: string;
}

export interface GeneratorHooks<
  TAnswers extends Record<string, unknown> = Record<string, unknown>,
> {
  beforeRender?: (ctx: GeneratorContext<TAnswers>) => Promise<void> | void;
  afterRender?: (ctx: GeneratorContext<TAnswers>) => Promise<void> | void;
}

export interface GeneratorDefinition<
  TAnswers extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Machine name, used in logs and error messages. */
  id: string;
  questions: Array<Question<TAnswers>>;
  template: TemplateSource;
  hooks?: GeneratorHooks<TAnswers>;
}
