/**
 * This function takes an array of strings and ensures that all of them
 * are set as environment variables. If any of them are not set, it will
 * throw an error. It returns an object with the environment variables
 * listed in the string.
 */
export const ensureEnvironmentVariables = (variables: string[]) => {
  const missingVariables = variables.filter(
    (variable) => !process.env[variable]
  );
  if (missingVariables.length) {
    throw new Error(
      `Missing environment variables: ${missingVariables.join(", ")}`
    );
  }
  return variables.reduce((acc: { [key: string]: string }, variable) => {
    acc[variable] = process.env[variable] as string;
    return acc;
  }, {});
};
