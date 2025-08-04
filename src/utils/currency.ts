export const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

export const generateRequestId = (): string => {
  return 'EM' + Date.now().toString().slice(-6);
};

export const calculateDueDate = (serviceType: string): string => {
  const now = new Date();
  let daysToAdd = 7;
  
  switch (serviceType) {
    case 'sharp-sharp':
      daysToAdd = 2;
      break;
    case 'market-runs':
      daysToAdd = 5;
      break;
    case 'others':
      daysToAdd = 10;
      break;
  }
  
  const dueDate = new Date(now.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
  return dueDate.toISOString().split('T')[0];
};