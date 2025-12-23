import React from "react";
import { Box, Typography, Paper, Divider, Alert } from "@mui/material";
import { LibraryBooks, Computer, Link as LinkIcon } from "@mui/icons-material";

export default function BorrowPolicySection() {
  return (
    <Box id="borrow-policy">
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 700,
          mb: 3,
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          color: "text.primary",
        }}
      >
        Mượn/ trả, gia hạn tài liệu
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Quy định áp dụng từ ngày 25/03/2024
      </Alert>

      {/* Đối tượng phục vụ */}
      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: "divider" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          1. Đối tượng phục vụ
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 1.5, lineHeight: 1.7 }}
        >
          • <strong>Bạn đọc trong Trường:</strong> Cán bộ, Giảng viên, Viên
          chức, Người lao động, Nghiên cứu sinh, Học viên, Sinh viên đang công
          tác và học tập tại Trường.
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          • <strong>Bạn đọc ngoài Trường:</strong> Các cá nhân có nhu cầu sử
          dụng Thư viện đã được cấp thẻ hoặc có giấy giới thiệu của cơ quan chủ
          quản và được sự đồng ý của Ban giám hiệu Trường và Ban Giám đốc Thư
          viện.
        </Typography>
      </Paper>

      {/* Tài liệu in */}
      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <LibraryBooks sx={{ color: "primary.main", mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            2a. Quy định về tài liệu in
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Mượn/trả, gia hạn tài liệu:
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 1, lineHeight: 1.7 }}
          >
            • Bạn đọc được mượn tối đa <strong>06 tài liệu</strong>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 1, lineHeight: 1.7 }}
          >
            • Giáo sư, Phó Giáo sư, Tiến sĩ được mượn tối đa{" "}
            <strong>09 tài liệu</strong>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 1, lineHeight: 1.7 }}
          >
            • Mượn đọc tại chỗ: 02 tài liệu/lần (không giới hạn số lần)
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 1, lineHeight: 1.7 }}
          >
            • Mượn về nhà: <strong>30 ngày/tài liệu</strong> (45 ngày cho GS,
            PGS, TS)
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 1, lineHeight: 1.7 }}
          >
            • Gia hạn: 01 lần thêm 15 ngày (trước ngày hết hạn 03 ngày)
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "error.main", fontWeight: 600 }}
          >
            ⚠ Phạt quá hạn: 2.000đ/cuốn/ngày (sau 03 ngày)
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Đặt mượn tài liệu:
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 1, lineHeight: 1.7 }}
        >
          • Đặt mượn qua cổng thông tin thư viện hoặc trực tiếp tại quầy
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 1, lineHeight: 1.7 }}
        >
          • Tối đa: 06 tài liệu, 03 lần/biểu ghi
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          • Nhận tài liệu trong 03 ngày kể từ khi được thông báo
        </Typography>
      </Paper>

      {/* Tài liệu số */}
      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Computer sx={{ color: "primary.main", mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            2b. Tài liệu số
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}
        >
          • <strong>Đọc tài liệu số:</strong> Bạn đọc trong trường được cấp tài
          khoản đăng nhập Thư viện số để đọc toàn văn tài liệu
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}
        >
          • <strong>Mượn tài liệu số</strong> (qua ứng dụng HBH DRM):
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 1, lineHeight: 1.7 }}
          >
            - Thời gian mượn: <strong>20 ngày/tài liệu</strong>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 1, lineHeight: 1.7 }}
          >
            - Gia hạn: 01 lần thêm 10 ngày
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 1, lineHeight: 1.7 }}
          >
            - Giới hạn thiết bị: <strong>02 thiết bị</strong>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            - Hỗ trợ đọc ngoại tuyến (offline) qua app HBH DRM
          </Typography>
        </Box>
      </Paper>

      {/* Cơ sở dữ liệu */}
      <Paper sx={{ p: 3, border: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <LinkIcon sx={{ color: "primary.main", mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            2c. Cơ sở dữ liệu điện tử
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}
        >
          • <strong>Springer:</strong> Truy cập qua mạng nội bộ, 50 người dùng
          đồng thời, sở hữu vĩnh viễn
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}
        >
          • <strong>Ebsco:</strong> Truy cập qua mạng nội bộ hoặc tài khoản cá
          nhân, sở hữu vĩnh viễn
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          • <strong>Cơ sở dữ liệu liên kết:</strong> Tùy theo chính sách từng bộ
          sưu tập
        </Typography>
      </Paper>
    </Box>
  );
}
