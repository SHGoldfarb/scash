export const validAccount = (data) => ({
  name: data.name || null,
  deactivatedAt: data.deactivatedAt || null,
});
