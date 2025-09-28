
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};


const getTimestamp = (): string => new Date().toLocaleTimeString();


export const info = (message: string, namespace: string = 'Server') => {
  console.log(
    `${colors.cyan}[${namespace}]${colors.reset} ${getTimestamp()} ${colors.green}[INFO]${colors.reset} ${message}`
  );
};


export const warn = (message: string, namespace: string = 'Server') => {
  console.log(
    `${colors.cyan}[${namespace}]${colors.reset} ${getTimestamp()} ${colors.yellow}[WARN]${colors.reset} ${message}`
  );
};


export const error = (message: string, error?: any, namespace: string = 'Server') => {
  console.error(
    `${colors.cyan}[${namespace}]${colors.reset} ${getTimestamp()} ${colors.red}[ERROR]${colors.reset} ${message}`
  );
  if (error) {
    console.error(error);
  }
};
