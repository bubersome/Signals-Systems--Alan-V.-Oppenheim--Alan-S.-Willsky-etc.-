import { translate } from '@vitalets/google-translate-api';

const { text } = await translate('Привет, мир! Как дела?', { to: 'en' });

console.log(text) // => 'Hello World! How are you?'