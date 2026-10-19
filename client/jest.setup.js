// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    })
  );
}
if (!global.Response) {
  global.Response = class Response {};
}
if (!global.Request) {
  global.Request = class Request {};
}
if (!global.Headers) {
  global.Headers = class Headers {};
}

jest.mock('@pusher/push-notifications-web', () => ({
  Client: jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue(),
    addDeviceInterest: jest.fn().mockResolvedValue(),
    removeDeviceInterest: jest.fn().mockResolvedValue(),
    getDeviceInterests: jest.fn().mockResolvedValue([]),
    setDeviceInterests: jest.fn().mockResolvedValue(),
    clearDeviceInterests: jest.fn().mockResolvedValue(),
    stop: jest.fn().mockResolvedValue(),
  })),
}), { virtual: true });

jest.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }) => children,
  useTranslations: () => (key) => key,
  useLocale: () => 'en',
  useFormatter: () => ({
    number: (n) => String(n),
    dateTime: (d) => String(d),
  }),
}));

