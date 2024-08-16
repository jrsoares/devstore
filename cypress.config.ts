import { defineConfig } from "cypress";
// @ts-ignore
import execa from "execa";

const findBrowser = () => {
  // the path is hard-coded for simplicity
  const browserPath =
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";

  // @ts-ignore
  return execa(browserPath, ["--version"]).then(
    (result: { stdout: string }) => {
      // STDOUT will be like "Brave Browser 77.0.69.135"
      // @ts-ignore
      const [, version] = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(
        result.stdout,
      );
      const majorVersion = parseInt(version.split(".")[0]);

      return {
        name: "Brave",
        channel: "stable",
        family: "chromium",
        displayName: "Brave",
        version,
        path: browserPath,
        majorVersion,
      };
    },
  );
};
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      return findBrowser().then((browser: any) => {
        return {
          browsers: config.browsers.concat(browser),
        };
      });
    },
    specPattern: "cypress/e2e/**/*.spec.{js,ts,jsx,tsx}",
  },
});
