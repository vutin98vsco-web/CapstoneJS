export function validateProduct(data) {
  const errors = {};
  if (!data.name || data.name.trim().length < 2) errors.name = "Tên sản phẩm phải có ít nhất 2 ký tự.";
  if (!data.category) errors.category = "Vui lòng chọn loại sản phẩm.";
  if (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0) errors.price = "Giá phải lớn hơn 0.";
  if (!data.image || !/^(https?:\/\/|\/)/i.test(data.image.trim())) errors.image = "Ảnh phải là URL http/https hoặc đường dẫn local bắt đầu bằng /.";
  if (!Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) errors.stock = "Tồn kho phải là số nguyên từ 0.";
  if (!data.description || data.description.trim().length < 10) errors.description = "Mô tả phải có ít nhất 10 ký tự.";
  if (data.variants?.some((variant) => !variant.storage || !Number.isFinite(Number(variant.price)) || Number(variant.price) <= 0)) errors.variants = "Mỗi dung lượng phải có tên và giá lớn hơn 0.";
  if (data.colors?.some((color) => !color.name || !color.image)) errors.colors = "Mỗi màu phải có tên và ảnh tương ứng.";
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
