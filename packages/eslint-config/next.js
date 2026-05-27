/** Next.js flavored ESLint config for Alessandrovaru apps. Extends the base config. */
module.exports = {
  extends: [require.resolve("./base.js"), "next/core-web-vitals"],
};
