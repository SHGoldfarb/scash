export const validCategory = (data) => ({
  name: data.name || null,
  deactivatedAt: data.deactivatedAt || null,
});
