export function DEBUG_LOG(msg: string, data?: unknown) {
  const log = Agtk.log as (a: unknown, b: string) => void;
  log(msg, 'Debug');

  if (data !== undefined) {
    log(data, 'Debug');
  }
}
