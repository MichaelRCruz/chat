export const required = value => (value ? undefined : ':)');
export const nonEmpty = value =>
    value.trim() !== '' ? undefined : 'Cannot be empty';
export const isTrimmed = value =>
    value.trim() === value ? undefined : 'Cannot start or end with whitespace';
export const length = length => value => {
    if (length.min && value.length < length.min) {
        return `Must be at least ${length.min} characters long`;
    }
    if (length.max && value.length > length.max) {
        return `Must be at most ${length.max} characters long`;
    }
};
export const matches = field => (value, allValues) =>
    field in allValues && value.trim() === allValues[field].trim()
        ? undefined
        : 'Does not match';

export const email = value =>
    /^\S+@\S+$/.test(value) ? undefined : 'Must be a valid email address';

export const mdTitle = value =>
  !value.trim().startsWith('#') ? undefined : 'No markdown titles, please.';

export const mdBullet = value =>
  !value.trim().startsWith('*') ? undefined : 'No bullets, please.';

export const otherThing = value =>
  !value.trim().startsWith('_``_') ? undefined : 'No funny business, please.';

export const codeBlock = value => {
  const codeBody = value.replace(/`/g, '').trim();
  if (!codeBody.length) {
    return 'No empty code blocks, please.';
  }
}
