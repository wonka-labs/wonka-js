import { _getWarningMesssage } from '../minting-utils';

test('Should get correct error message for code 311', () => {
  expect(_getWarningMesssage({code: 311, msg: " "})).toBe('All mints have been sold out.');
});

