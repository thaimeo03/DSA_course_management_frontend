import { ProgrammingLanguage } from '@app/enums';

export const PROGRAMMING_LANGUAGE: Record<string, string> = {
  [ProgrammingLanguage.Javascript]: 'Javascript',
  [ProgrammingLanguage.Python]: 'Python',
  [ProgrammingLanguage.Java]: 'Java',
};

export const YTB_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
