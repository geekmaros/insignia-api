export const publicCardUrl = (slug: string) => {
  return `${process.env.PUBLIC_APP_URL}/c/${slug}`;
};
