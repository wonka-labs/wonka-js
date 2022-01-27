import { _sanitizeB64String } from '../arweave-uploader';

test('Should correctly sanitize base64', () => {
  expect(_sanitizeB64String("data:image/png;base64, iVBORw0KGgoAAAA")).toBe('iVBORw0KGgoAAAA');
});
