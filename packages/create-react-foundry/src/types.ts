export interface ProjectAnswers extends Record<string, unknown> {
  projectName: string;
  /** npm scope the generated packages publish under, e.g. "@acme". */
  packageScope: string;
  /**
   * Namespace for generated CSS custom properties, e.g. "fd" → --fd-color-primary.
   * Not a prompt — resolved from --token-prefix (default "fd") in index.ts and
   * injected via initialAnswers, since a sensible default beats one more question.
   */
  tokenPrefix: string;
  /**
   * SPDX identifier ("Apache-2.0" or "MIT") substituted into every package.json.
   * Not a prompt — resolved from --license (default "apache-2.0") in index.ts.
   */
  license: string;
  /** Substituted into LICENSE-*'s copyright line. Computed, never asked. */
  currentYear: string;
  initGit: boolean;
}
