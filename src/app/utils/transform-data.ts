import { BidvDay, BidvTime } from '@bidv-ui/cdk';

export const getDateTime = (date: string) => {
  const formattedDate = BidvDay.fromUtcNativeDate(
    new Date(date),
  ).getFormattedDay('DMY', '/');

  const formattedTime = BidvTime.fromLocalNativeDate(new Date(date)).toString(
    'HH:MM:SS',
  );

  return `${formattedTime} ${formattedDate}`;
};
