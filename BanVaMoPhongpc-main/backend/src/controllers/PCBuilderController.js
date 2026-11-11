// PC Builder: frontend gửi các linh kiện đã chọn, server trả danh sách tương thích + cảnh báo.
const PCBuilderModel = require("../models/PCBuilderModel");

async function show(req, res) {
  const selected = {
    cpuId: Number(req.query.cpuId) || null,
    mainboardId: Number(req.query.mainboardId) || null,
    ramId: Number(req.query.ramId) || null,
    gpuId: Number(req.query.gpuId) || null,
    psuId: Number(req.query.psuId) || null,
  };
  res.json(await PCBuilderModel.buildCompatibility(selected));
}

module.exports = { show };
