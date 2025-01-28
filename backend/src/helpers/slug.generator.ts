export const slugGenerator = (title: string) =>
  title.toLowerCase().replace(/ /gi, "-") + "-" + new Date().valueOf();
