// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function format(template: string, ...args: any[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== 'undefined' ? args[index] : match;
  });
}
