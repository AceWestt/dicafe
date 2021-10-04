export const getObjLentgh = (obj) => {
  let size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== undefined)
      size++;
  }
  return size;
};
