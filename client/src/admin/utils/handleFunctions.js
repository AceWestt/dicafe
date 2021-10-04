import { validateImgs } from "./validate";

export const handleImgUpload = (
  e,
  setImg,
  setTmpImg,
  setErrors,
  errors,
  field
) => {
  const validate = validateImgs(e.target.files[0]);
  if (validate.valid) {
    setImg(e.target.files[0]);
    setTmpImg(URL.createObjectURL(e.target.files[0]));
    setErrors({ ...errors, [field]: undefined });
  } else {
    setImg(null);
    setTmpImg(null);
    setErrors({ ...errors, [field]: validate.msg });
  }
};
