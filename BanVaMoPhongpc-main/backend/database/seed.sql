-- Dữ liệu mẫu, chỉ chạy khi bảng users còn trống.
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@store.test', 'admin123', 'admin'),
('Khach hang', 'user@store.test', 'user123', 'customer');

-- Linh kiện (mỗi loại dùng chung 1 ảnh trong /uploads)
INSERT INTO products (name, category, brand, price, stock, image, featured, performance, specs) VALUES
('Intel Core i5-14600K', 'CPU', 'Intel', 8290000, 18, '/uploads/cpu.jpg', 1, 87, '{"socket":"LGA1700","cores":"14 nhân 20 luồng","tdp":"125W","ram":"DDR4/DDR5"}'),
('AMD Ryzen 7 7800X3D', 'CPU', 'AMD', 10490000, 12, '/uploads/cpu.jpg', 1, 94, '{"socket":"AM5","cores":"8 nhân 16 luồng","tdp":"120W","ram":"DDR5"}'),
('ASUS TUF RTX 4070 Super', 'GPU', 'ASUS', 17990000, 8, '/uploads/gpu.jpg', 1, 92, '{"vram":"12GB GDDR6X","psu":"650W","slot":"PCIe 4.0","length":"301mm"}'),
('MSI B760 Tomahawk WiFi', 'Mainboard', 'MSI', 4890000, 16, '/uploads/mainboard.jpg', 0, 79, '{"socket":"LGA1700","ram":"DDR5","form":"ATX","chipset":"B760"}'),
('Gigabyte B650 Aorus Elite AX', 'Mainboard', 'Gigabyte', 5790000, 11, '/uploads/mainboard.jpg', 1, 84, '{"socket":"AM5","ram":"DDR5","form":"ATX","chipset":"B650"}'),
('Corsair Vengeance 32GB DDR5', 'RAM', 'Corsair', 3290000, 24, '/uploads/ram.jpg', 0, 86, '{"type":"DDR5","bus":"6000MHz","capacity":"32GB","kit":"2x16GB"}'),
('Samsung 990 Pro 1TB', 'SSD', 'Samsung', 2990000, 20, '/uploads/ssd.jpg', 0, 90, '{"type":"NVMe","speed":"7450MB/s","capacity":"1TB","pcie":"4.0"}'),
('Cooler Master MWE Gold 750W', 'PSU', 'Cooler Master', 2390000, 14, '/uploads/psu.jpg', 0, 82, '{"power":"750W","rating":"80 Plus Gold","modular":"Full modular"}');

-- PC Build sẵn: 4 phân khúc giá (cột specs có thêm "tier" để chatbot và trang web hiển thị)
INSERT INTO products (name, category, brand, price, stock, image, featured, performance, specs) VALUES
('KaDa PC Rẻ nhất 15 triệu', 'PC Build sẵn', 'KaDa Store', 14990000, 10, '/uploads/pc-15tr.jpg', 1, 60, '{"tier":"Rẻ nhất","cpu":"Intel Core i5-12400F","gpu":"NVIDIA RTX 3050 8GB","ram":"16GB DDR4","ssd":"500GB NVMe","psu":"550W 80 Plus","use":"Học tập, văn phòng, chơi game nhẹ"}'),
('KaDa PC Trung bình 25 triệu', 'PC Build sẵn', 'KaDa Store', 24990000, 8, '/uploads/pc-25tr.jpg', 1, 75, '{"tier":"Trung bình","cpu":"Intel Core i5-14400F","gpu":"NVIDIA RTX 4060 Ti 8GB","ram":"16GB DDR5","ssd":"1TB NVMe","psu":"650W 80 Plus Bronze","use":"Chơi game Full HD/2K mượt"}'),
('KaDa PC Cao cấp 50 triệu', 'PC Build sẵn', 'KaDa Store', 49990000, 5, '/uploads/pc-50tr.jpg', 1, 90, '{"tier":"Cao cấp","cpu":"AMD Ryzen 7 7800X3D","gpu":"NVIDIA RTX 4080 Super 16GB","ram":"32GB DDR5","ssd":"2TB NVMe","psu":"850W 80 Plus Gold","use":"Game 2K/4K, đồ họa, livestream"}'),
('KaDa PC VIP Pro 100 triệu', 'PC Build sẵn', 'KaDa Store', 99990000, 3, '/uploads/pc-100tr.jpg', 1, 99, '{"tier":"VIP Pro","cpu":"Intel Core i9-14900K","gpu":"NVIDIA RTX 4090 24GB","ram":"64GB DDR5","ssd":"4TB NVMe","psu":"1200W 80 Plus Platinum","use":"Dựng phim 4K, AI, game 4K tối đa"}');
