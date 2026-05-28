export const logger = {
  info(message: string) {
    console.info(`[info] ${message}`);
  },
  error(error: unknown) {
    console.error("[error]", error);
  },
};
