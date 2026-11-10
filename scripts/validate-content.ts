import { validateContent } from "../src/lib/content-validation";
import { getAllCategories } from "../src/lib/content";

const result = validateContent();

if (!result.valid) {
  console.error(`Content validation failed with ${result.errors.length} error(s):`);
  for (const error of result.errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.info("Content validation passed.");
  for (const category of getAllCategories()) {
    console.info(`- ${category.title}: ${category.questionIds.length} questions`);
  }
}
