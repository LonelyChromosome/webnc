// Logic PC Builder: lọc linh kiện tương thích và cảnh báo.
// Quy tắc: CPU và Mainboard cùng socket; RAM đúng chuẩn DDR của mainboard; nguồn đủ công suất cho GPU.
const ProductModel = require("./ProductModel");

const slots = ["CPU", "Mainboard", "RAM", "GPU", "SSD", "PSU"];

function getSlots() {
  return slots;
}

// Danh sách lựa chọn cho 1 ô. Mainboard lọc theo CPU đã chọn, RAM lọc theo Mainboard đã chọn.
async function getOptions(slot, selected = {}) {
  const products = await ProductModel.getAll({ category: slot });
  if (slot === "Mainboard" && selected.cpuId) {
    const cpu = await ProductModel.getById(selected.cpuId);
    return products.filter((item) => item.specs.socket === cpu?.specs.socket);
  }
  if (slot === "RAM" && selected.mainboardId) {
    const mainboard = await ProductModel.getById(selected.mainboardId);
    return products.filter((item) => item.specs.type === mainboard?.specs.ram);
  }
  return products;
}

const watt = (text) => parseInt(String(text || "0"), 10) || 0; // "650W" -> 650

async function buildCompatibility(selected = {}) {
  const cpu = await ProductModel.getById(selected.cpuId);
  const mainboard = await ProductModel.getById(selected.mainboardId);
  const ram = await ProductModel.getById(selected.ramId);
  const gpu = await ProductModel.getById(selected.gpuId);
  const psu = await ProductModel.getById(selected.psuId);
  const warnings = [];

  if (cpu && mainboard && cpu.specs.socket !== mainboard.specs.socket) warnings.push("CPU và mainboard không cùng socket.");
  if (ram && mainboard && ram.specs.type !== mainboard.specs.ram) warnings.push("RAM không đúng chuẩn hỗ trợ của mainboard.");
  if (gpu && psu && watt(psu.specs.power) < watt(gpu.specs.psu)) warnings.push(`Card đồ họa cần nguồn tối thiểu ${gpu.specs.psu}.`);

  return {
    slots,
    warnings,
    options: {
      CPU: await getOptions("CPU"),
      Mainboard: await getOptions("Mainboard", { cpuId: cpu?.id }),
      RAM: await getOptions("RAM", { mainboardId: mainboard?.id }),
      GPU: await getOptions("GPU"),
      SSD: await getOptions("SSD"),
      PSU: await getOptions("PSU"),
    },
  };
}

module.exports = { getSlots, getOptions, buildCompatibility };
