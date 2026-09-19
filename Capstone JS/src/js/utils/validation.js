export function validateProduct(data) {
  const errors = {};
  if (!data.name || data.name.trim().length < 2) errors.name = "Tên sản phẩm phải có ít nhất 2 ký tự.";
  if (!data.category) errors.category = "Vui lòng chọn loại sản phẩm.";
  if (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0) errors.price = "Giá phải lớn hơn 0.";
  if (!data.image || !/^https?:\/\//i.test(data.image.trim())) errors.image = "Ảnh phải là đường dẫn http/https hợp lệ.";
  if (!Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) errors.stock = "Tồn kho phải là số nguyên từ 0.";
  if (!data.description || data.description.trim().length < 10) errors.description = "Mô tả phải có ít nhất 10 ký tự.";
  return errors;
}

export function validateStore(data) {
  const errors = {};
  if (!data.name || data.name.trim().length < 3) errors.name = "Tên chi nhánh phải có ít nhất 3 ký tự.";
  if (!data.address || data.address.trim().length < 8) errors.address = "Địa chỉ phải có ít nhất 8 ký tự.";
  if (!data.hours) errors.hours = "Vui lòng nhập giờ mở cửa.";
  if (!data.phone || data.phone.replace(/\D/g, "").length < 9) errors.phone = "Số điện thoại chưa hợp lệ.";
  return errors;
}
