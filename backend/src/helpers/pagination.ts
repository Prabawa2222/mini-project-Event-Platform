export const pagination = (page: number, take: number = 5) => {
  const skip = !page || page < 1 ? 0 : (page - 1) * Number(take || 5);
  return { skip, take };
};
