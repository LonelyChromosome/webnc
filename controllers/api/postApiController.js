const postModel = require("../../models/postModel");

async function index(req, res) {
  try {
    const posts = await postModel.getAllPosts();

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách bài viết"
    });
  }
}

async function show(req, res) {
  try {
    const id = req.params.id;
    const post = await postModel.getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết"
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết bài viết"
    });
  }
}

async function search(req, res) {
  try {
    const keyword = req.query.keyword || "";
    const posts = await postModel.searchPosts(keyword);

    res.json({
      success: true,
      keyword,
      data: posts
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm bài viết"
    });
  }
}

async function store(req, res) {
  try {
    const title = req.body.title;
    const description = req.body.description;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ title và description"
      });
    }

    await postModel.createPost(title, description);

    res.status(201).json({
      success: true,
      message: "Thêm bài viết thành công"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm bài viết"
    });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const title = req.body.title;
    const description = req.body.description;

    const post = await postModel.getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết"
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ title và description"
      });
    }

    await postModel.updatePost(id, title, description);

    res.json({
      success: true,
      message: "Cập nhật bài viết thành công"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật bài viết"
    });
  }
}

async function destroy(req, res) {
  try {
    const id = req.params.id;
    const post = await postModel.getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết"
      });
    }

    await postModel.deletePost(id);

    res.json({
      success: true,
      message: "Xóa bài viết thành công"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa bài viết"
    });
  }
}

module.exports = {
  index,
  show,
  search,
  store,
  update,
  destroy
};
