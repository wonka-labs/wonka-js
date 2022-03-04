import { _getWarningMesssage } from '../utils/minting-utils';

test('Should get correct error message for not enough sol error', () => {
  expect(_getWarningMesssage({
    message: 'error SendTransactionError: failed to send transaction: Transaction simulation failed: Error processing Instruction 4: custom program error: 0x1778',
  })).toBe('Not enough SOL to pay for this minting');
});
