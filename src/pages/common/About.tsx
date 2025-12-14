import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SeoMetaTags from "../../shared/components/SeoMetaTags";
import Footer from "../../shared/ui/Footer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`about-tabpanel-${index}`}
      aria-labelledby={`about-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
    </div>
  );
}

export default function About(): React.ReactElement {
  const [tabValue, setTabValue] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    false
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };

  return (
    <>
      <SeoMetaTags
        title="Về chúng tôi - Thư viện HBH"
        description="Thông tin về Trung tâm Thư viện Trường Đại học HBH"
        keywords="về chúng tôi, thư viện HBH, lịch sử, chức năng, nhiệm vụ"
      />

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: { xs: 6, md: 8 },
            mb: 4,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h1"
              fontWeight={700}
              gutterBottom
            >
              Về chúng tôi
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 700 }}>
              Trung tâm Thư viện Trường Đại học Kinh tế - Kỹ thuật Công nghiệp
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ pb: 8 }}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                px: 2,
                bgcolor: "background.paper",
              }}
            >
              <Tab label="Giới thiệu" />
              <Tab label="Chức năng & Nhiệm vụ" />
              <Tab label="Cơ cấu tổ chức" />
              <Tab label="Quy định sử dụng" />
            </Tabs>

            <Box sx={{ bgcolor: "background.paper" }}>
              <TabPanel value={tabValue} index={0}>
                <Container maxWidth="md">
                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      color="primary"
                    >
                      Lịch sử hình thành và phát triển
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Box
                      sx={{
                        pl: 3,
                        borderLeft: "3px solid",
                        borderColor: "primary.main",
                        mb: 3,
                      }}
                    >
                      <Typography variant="body1" paragraph>
                        Trung tâm Thư viện Trường Đại học HBH được thành lập
                        theo Công nghiệp được thành lập theo{" "}
                        <strong>Quyết định số: 358/QĐ-ĐHKTKTCN</strong> ngày 04
                        tháng 08 năm 2020 của Hiệu trưởng, trên cơ sở tách ra từ
                        tổ Thư viện trực thuộc phòng Đào tạo trước đây, trở
                        thành một đơn vị độc lập.
                      </Typography>
                    </Box>

                    <Typography variant="body1" paragraph>
                      Trung tâm Thư viện được Lãnh đạo Trường định hướng phát
                      triển theo mô hình lấy{" "}
                      <strong>Bạn đọc làm trung tâm</strong>, được Nhà trường
                      đầu tư nâng cấp, xây dựng trong thời gian vừa qua tạo nên
                      một không gian giáo dục, trong đó có các thiết bị chuyên
                      dùng hiện đại, hạ tầng mạng, không gian mở, phòng đọc,
                      phòng học nhóm, phòng hội thảo và phòng tự học, phục vụ
                      tốt nhất cho Bạn đọc đến với Thư viện.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      color="primary"
                    >
                      Nguồn lực và công nghệ
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="body1" paragraph>
                      Thư viện áp dụng khung phân loại <strong>DDC</strong>,
                      tiêu chuẩn quốc tế về mô tả biên mục{" "}
                      <strong>AACR2</strong> và tiêu chuẩn{" "}
                      <strong>Dublin Core</strong> để nâng cao hiệu quả hoạt
                      động Thư viện.
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, 1fr)",
                        },
                        gap: 2,
                        my: 3,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 3,
                          bgcolor: "background.default",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="primary"
                          gutterBottom
                        >
                          11.000+
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Đầu sách in
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 3,
                          bgcolor: "background.default",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="primary"
                          gutterBottom
                        >
                          5.000+
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tài liệu số
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 3,
                          bgcolor: "background.default",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="primary"
                          gutterBottom
                        >
                          1.798
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tài liệu EBSCO & Springer
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 3,
                          bgcolor: "background.default",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="primary"
                          gutterBottom
                        >
                          13
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cán bộ chuyên môn
                        </Typography>
                      </Paper>
                    </Box>

                    <Typography variant="body1" paragraph>
                      Thư viện đã liên kết chia sẻ nguồn tài nguyên với Thư viện
                      Trường Đại học Thương mại. Ngoài ra, Thư viện cũng có các
                      CSDL liên kết trong nước và quốc tế như: Tài nguyên số của
                      Trung tâm Truyền thông và Tri thức số - Đại học Bách Khoa
                      HN; Trung tâm kết nối Tri thức số; CSDL điện tử EBSCO và
                      CSDL điện tử Springer.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      color="primary"
                    >
                      Phương châm phục vụ
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                        mb: 3,
                      }}
                    >
                      <Chip
                        label="VUI VẺ"
                        color="primary"
                        sx={{ fontWeight: 600, px: 1 }}
                      />
                      <Chip
                        label="TẬN TÂM"
                        color="primary"
                        sx={{ fontWeight: 600, px: 1 }}
                      />
                      <Chip
                        label="KẾT NỐI"
                        color="primary"
                        sx={{ fontWeight: 600, px: 1 }}
                      />
                      <Chip
                        label="VĂN MINH"
                        color="primary"
                        sx={{ fontWeight: 600, px: 1 }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      mb: 5,
                      p: 3,
                      bgcolor: "background.default",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      color="primary"
                    >
                      Thông tin liên hệ
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          gutterBottom
                        >
                          Địa điểm Minh Khai
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tầng 1 - HA5 - 419/17/16 Minh Khai, Phường Vĩnh Tuy,
                          TP. Hà Nội
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Thứ 2 - Thứ 6: 08:00 - 12:00, 13:00 - 17:00
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          gutterBottom
                        >
                          Địa điểm Lĩnh Nam
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tầng 2 - HA10 - 419/17/16, Phường Hoàng Mai, TP. Hà
                          Nội
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Thứ 2 - Thứ 6: 08:00 - 12:00, 13:00 - 17:00
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          gutterBottom
                        >
                          Địa điểm Nam Định
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tòa nhà Thư viện - 419/17/16 Trần Hưng Đạo, Phường Nam
                          Định, Tỉnh Ninh Bình
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Thứ 2 - Thứ 6: 07:30 - 11:30, 13:00 - 17:00
                        </Typography>
                      </Box>

                      <Divider />

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Website:</strong> https://hbh.libsys.me
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Email:</strong> thuvien@hbh.libsys.me
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Fanpage:</strong> Thư viện Trường Đại học HBH
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Container>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Container maxWidth="md">
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      color="primary"
                    >
                      Chức năng của thư viện
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Typography variant="body1" paragraph>
                      Trung tâm Thư viện có chức năng tham mưu, giúp việc cho
                      Hiệu trưởng thực hiện công tác quản lý hoạt động của Thư
                      viện để phục vụ tốt cho công tác giảng dạy, học tập,
                      nghiên cứu khoa học thông qua việc sử dụng, khai thác các
                      loại tài liệu có trong Thư viện.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      color="primary"
                    >
                      Nhiệm vụ của thư viện
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {[
                        "Xây dựng, xử lý, lưu giữ, bảo quản, kết nối và phát triển tài nguyên thông tin phù hợp với người sử dụng thư viện; phù hợp với mục tiêu, nội dung, chương trình, lĩnh vực, ngành đào tạo, nghiên cứu khoa học và phát triển công nghệ của cơ sở giáo dục đại học.",
                        "Tổ chức sử dụng chung tài nguyên thông tin, sản phẩm thông tin và dịch vụ thư viện; truyền bá tri thức, giá trị văn hóa của dân tộc và nhân loại; phục vụ nhu cầu nghiên cứu, học tập, giải trí; góp phần hình thành và phát triển kiến thức, kỹ năng, phẩm chất, năng lực của người sử dụng thư viện.",
                        "Ứng dụng thành tựu khoa học và công nghệ, hiện đại hóa thư viện.",
                        "Phát triển văn hóa đọc và góp phần tạo môi trường học tập suốt đời cho bạn đọc, xây dựng xã hội học tập, nâng cao dân trí, xây dựng con người Việt Nam toàn diện.",
                        "Tiếp nhận, bổ sung và tổ chức khai thác khóa luận, đồ án, luận văn, luận án, kết quả nghiên cứu khoa học của người học và người dạy trong cơ sở giáo dục đại học; xây dựng tài liệu nội sinh, cơ sở dữ liệu học liệu, tài nguyên học liệu mở.",
                        "Tổ chức không gian đọc; hướng dẫn sử dụng sản phẩm thư viện và dịch vụ thư viện; hoàn thiện kỹ năng tìm kiếm, khai thác và sử dụng thông tin; củng cố, mở rộng kiến thức cho người học, người dạy và cán bộ quản lý.",
                        "Thực hiện liên thông, liên kết với thư viện trong nước và nước ngoài.",
                        "Xây dựng kế hoạch bồi dưỡng chuyên môn, ngoại ngữ, tin học cho cán bộ thư viện để phát triển nguồn nhân lực có chất lượng nhằm nâng cao hiệu quả công tác.",
                        "Tổ chức thực hiện quản lý cơ sở vật chất và tài sản của thư viện; báo cáo tình hình hoạt động hàng năm và báo cáo đột xuất khi có yêu cầu của các cấp có thẩm quyền và thực hiện khảo sát đánh giá của bạn đọc về thư viện.",
                        "Thực hiện quản lý, hướng dẫn quy trình về công tác biên soạn, hoàn thiện hồ sơ, thu nhận sản phẩm về giáo trình và tài liệu học tập, biên tập, số hóa giáo trình, tài liệu học tập, tài liệu nội sinh theo Quy định của Trường.",
                        "Thực hiện quản lý công tác phát triển Giáo trình và Tài liệu học tập đáp ứng theo chương trình đào tạo.",
                        "Thực hiện các nhiệm vụ khác do nhà trường giao.",
                      ].map((task, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            gap: 2,
                            p: 2,
                            bgcolor: "background.default",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant="h6"
                            color="primary"
                            fontWeight={600}
                            sx={{ minWidth: 35 }}
                          >
                            {index + 1}.
                          </Typography>
                          <Typography variant="body2">{task}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      (Trích theo Quyết định số 501/QĐ-ĐHKTKTCN, ngày 10 tháng
                      10 năm 2021 của Hiệu trưởng về việc ban hành Quy chế tổ
                      chức và hoạt động của Trung tâm Thư viện trường Đại học
                      HBH)
                    </Typography>
                  </Box>
                </Container>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Container maxWidth="lg">
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      color="primary"
                    >
                      Cơ cấu tổ chức
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="body1" paragraph>
                      Hiện nay, Trung tâm Thư viện là một đơn vị thuộc Trường
                      Đại học Kinh tế - Kỹ thuật Công nghiệp, có đội ngũ nhân sự
                      gồm <strong>01 Giám đốc</strong> và{" "}
                      <strong>12 cán bộ chuyên môn nghiệp vụ</strong> được phân
                      công thực hiện nhiệm vụ tại 03 địa điểm của 02 cơ sở.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      color="text.primary"
                    >
                      Sơ đồ tổ chức
                    </Typography>
                    <Paper
                      sx={{
                        p: 4,
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        overflow: "auto",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 3,
                          minWidth: 600,
                        }}
                      >
                        <Paper
                          sx={{
                            px: 4,
                            py: 2,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: 700,
                            textAlign: "center",
                            minWidth: 200,
                          }}
                        >
                          GIÁM ĐỐC
                        </Paper>

                        <Box
                          sx={{
                            width: 2,
                            height: 40,
                            bgcolor: "divider",
                          }}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            gap: 4,
                            justifyContent: "center",
                            flexWrap: "wrap",
                            position: "relative",
                            alignItems: "flex-start",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: "15%",
                              right: "15%",
                              height: 2,
                              bgcolor: "divider",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              flex: "0 0 250px",
                            }}
                          >
                            <Box
                              sx={{
                                width: 2,
                                height: 20,
                                bgcolor: "divider",
                              }}
                            />
                            <Paper
                              sx={{
                                width: "100%",
                                height: 180,
                                display: "flex",
                                flexDirection: "column",
                                border: "1px solid",
                                borderColor: "divider",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  bgcolor: "primary.main",
                                  color: "primary.contrastText",
                                  py: 1,
                                  px: 2,
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                }}
                              >
                                BỘ PHẬN
                              </Box>
                              <Box
                                sx={{
                                  bgcolor: "action.hover",
                                  flex: 1,
                                  py: 1.5,
                                  px: 2,
                                  fontSize: "0.875rem",
                                  textAlign: "center",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                Quản lý, phát triển thư viện số và Quản lý hệ
                                thống cơ sở dữ liệu
                              </Box>
                              <Box
                                sx={{
                                  bgcolor: "action.hover",
                                  py: 1,
                                  px: 2,
                                  borderTop: "1px solid",
                                  borderColor: "divider",
                                  fontSize: "0.875rem",
                                  textAlign: "center",
                                }}
                              >
                                CÁN BỘ PHỤ TRÁCH
                              </Box>
                            </Paper>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              flex: "0 0 250px",
                            }}
                          >
                            <Box
                              sx={{
                                width: 2,
                                height: 20,
                                bgcolor: "divider",
                              }}
                            />
                            <Paper
                              sx={{
                                width: "100%",
                                height: 180,
                                display: "flex",
                                flexDirection: "column",
                                border: "1px solid",
                                borderColor: "divider",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  bgcolor: "primary.main",
                                  color: "primary.contrastText",
                                  py: 1,
                                  px: 2,
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                }}
                              >
                                BỘ PHẬN
                              </Box>
                              <Box
                                sx={{
                                  bgcolor: "action.hover",
                                  flex: 1,
                                  py: 1.5,
                                  px: 2,
                                  fontSize: "0.875rem",
                                  textAlign: "center",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                Phát triển nguồn tài nguyên Thư viện và Đảm bảo
                                chất lượng
                              </Box>
                              <Box
                                sx={{
                                  bgcolor: "action.hover",
                                  py: 1,
                                  px: 2,
                                  borderTop: "1px solid",
                                  borderColor: "divider",
                                  fontSize: "0.875rem",
                                  textAlign: "center",
                                }}
                              >
                                CÁN BỘ PHỤ TRÁCH
                              </Box>
                            </Paper>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              flex: "0 0 250px",
                            }}
                          >
                            <Box
                              sx={{
                                width: 2,
                                height: 20,
                                bgcolor: "divider",
                              }}
                            />
                            <Paper
                              sx={{
                                width: "100%",
                                height: 180,
                                display: "flex",
                                flexDirection: "column",
                                border: "1px solid",
                                borderColor: "divider",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  bgcolor: "primary.main",
                                  color: "primary.contrastText",
                                  py: 1,
                                  px: 2,
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                }}
                              >
                                BỘ PHẬN
                              </Box>
                              <Box
                                sx={{
                                  bgcolor: "action.hover",
                                  flex: 1,
                                  py: 1.5,
                                  px: 2,
                                  fontSize: "0.875rem",
                                  textAlign: "center",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                Phát triển Văn hóa đọc và Tư vấn phục vụ thông
                                tin
                              </Box>
                              <Box
                                sx={{
                                  bgcolor: "action.hover",
                                  py: 1,
                                  px: 2,
                                  borderTop: "1px solid",
                                  borderColor: "divider",
                                  fontSize: "0.875rem",
                                  textAlign: "center",
                                }}
                              >
                                CÁN BỘ PHỤ TRÁCH
                              </Box>
                            </Paper>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>

                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      color="text.primary"
                    >
                      Danh sách nhân sự
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <TableContainer
                        component={Paper}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Table
                          sx={{
                            borderCollapse: "collapse",
                            "& td, & th": {
                              border: "1px solid",
                              borderColor: "divider",
                            },
                          }}
                        >
                          <TableHead>
                            <TableRow
                              sx={{
                                bgcolor: "primary.main",
                              }}
                            >
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: 700,
                                  py: 1.5,
                                  color: "primary.contrastText",
                                }}
                              >
                                STT
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 700,
                                  py: 1.5,
                                  color: "primary.contrastText",
                                }}
                              >
                                Họ và tên
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: 700,
                                  py: 1.5,
                                  color: "primary.contrastText",
                                }}
                              >
                                Cơ sở
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: 700,
                                  py: 1.5,
                                  color: "primary.contrastText",
                                }}
                              >
                                Trình độ
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 700,
                                  py: 1.5,
                                  color: "primary.contrastText",
                                }}
                              >
                                Chức vụ
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {[
                              {
                                stt: 1,
                                name: "Trần Kính Hoàng",
                                location: "Hà Nội",
                                degree: "Sinh viên",
                                position: "Giám đốc",
                              },
                              {
                                stt: 2,
                                name: "Lê Văn Huy",
                                location: "Hà Nội",
                                degree: "Sinh viên",
                                position: "Tổ trưởng ĐP, CB nghiệp vụ",
                              },
                              {
                                stt: 3,
                                name: "Tạ Hữu Anh Bình",
                                location: "Hà Nội",
                                degree: "Sinh viên",
                                position: "Cán bộ nghiệp vụ",
                              },
                            ].map((staff) => (
                              <TableRow
                                key={staff.stt}
                                sx={{
                                  "&:nth-of-type(odd)": {
                                    bgcolor: "background.default",
                                  },
                                  "&:hover": {
                                    bgcolor: "action.hover",
                                  },
                                }}
                              >
                                <TableCell align="center" sx={{ py: 1.5 }}>
                                  {staff.stt}
                                </TableCell>
                                <TableCell sx={{ py: 1.5 }}>
                                  {staff.name}
                                </TableCell>
                                <TableCell align="center" sx={{ py: 1.5 }}>
                                  {staff.location}
                                </TableCell>
                                <TableCell align="center" sx={{ py: 1.5 }}>
                                  {staff.degree}
                                </TableCell>
                                <TableCell sx={{ py: 1.5 }}>
                                  {staff.position}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      color="text.primary"
                    >
                      Địa điểm làm việc
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          md: "repeat(3, 1fr)",
                        },
                        gap: 3,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: "center",
                          bgcolor: "background.default",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary"
                          gutterBottom
                        >
                          Minh Khai
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tầng 1 - HA5
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          419/17/16 Minh Khai, Vĩnh Tuy
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          TP. Hà Nội
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 3,
                          textAlign: "center",
                          bgcolor: "background.default",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary"
                          gutterBottom
                        >
                          Lĩnh Nam
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tầng 2 - HA10
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          419/17/16 Lĩnh Nam, Hoàng Mai
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          TP. Hà Nội
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 3,
                          textAlign: "center",
                          bgcolor: "background.default",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary"
                          gutterBottom
                        >
                          Nam Định
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tòa Thư viện
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          419/17/16 Trần Hưng Đạo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tỉnh Ninh Bình
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </Container>
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Container maxWidth="md">
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      gutterBottom
                      color="primary"
                    >
                      Quy định sử dụng thư viện HBH
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Áp dụng từ ngày 25/03/2024
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Accordion
                      expanded={expandedAccordion === "panel1"}
                      onChange={handleAccordionChange("panel1")}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary>
                        <Typography variant="subtitle1" fontWeight={600}>
                          I. Quy định chung
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              gutterBottom
                            >
                              1. Đối tượng phục vụ
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Bạn đọc trong Trường: Cán bộ, Giảng viên, Viên
                              chức, Người lao động, Nghiên cứu sinh, Học viên,
                              Sinh viên đang công tác và học tập tại Trường.
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1 }}
                            >
                              Bạn đọc ngoài Trường: Các cá nhân có nhu cầu sử
                              dụng Thư viện đã được cấp thẻ hoặc có giấy giới
                              thiệu của cơ quan chủ quản và được sự đồng ý của
                              Ban giám hiệu Trường và Ban Giám đốc Thư viện.
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              gutterBottom
                            >
                              2. Quy định sử dụng
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, m: 0 }}>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Xuất trình thẻ khi đến Thư viện
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Không cho mượn hoặc dùng thẻ của người khác
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Trang phục lịch sự, không gây tiếng ồn
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Giữ gìn vệ sinh chung, không hút thuốc, không
                                mang đồ ăn thức uống
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Không mang thiết bị, chất dễ cháy nổ vào Thư
                                viện
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Sử dụng tài liệu, cơ sở vật chất theo đúng quy
                                định
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion
                      expanded={expandedAccordion === "panel2"}
                      onChange={handleAccordionChange("panel2")}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary>
                        <Typography variant="subtitle1" fontWeight={600}>
                          II. Quy định về tài liệu in
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              gutterBottom
                            >
                              Mượn tài liệu
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, m: 0 }}>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Tối đa: 6 tài liệu (9 tài liệu với Giáo sư, Phó
                                Giáo sư, Tiến sĩ)
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Mượn đọc tại chỗ: 2 tài liệu/lần (3 tài liệu với
                                PGS, GS, TS)
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Mượn về nhà: 30 ngày/tài liệu (45 ngày với PGS,
                                GS, TS)
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Gia hạn: 1 lần/tài liệu, thêm 15 ngày
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Phạt quá hạn: 2.000 VNĐ/cuốn/ngày (từ ngày thứ 4
                                trở đi)
                              </Typography>
                            </Box>
                          </Box>

                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              gutterBottom
                            >
                              Đặt mượn tài liệu
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, m: 0 }}>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Tối đa: 6 tài liệu, 6 tài liệu/ngày
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Giới hạn: 3 lần/biểu ghi
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Nhận tài liệu trong 3 ngày sau khi được đáp ứng
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion
                      expanded={expandedAccordion === "panel3"}
                      onChange={handleAccordionChange("panel3")}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary>
                        <Typography variant="subtitle1" fontWeight={600}>
                          III. Quy định về tài liệu số
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              gutterBottom
                            >
                              Mượn tài liệu số
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, m: 0 }}>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Thời gian mượn: 20 ngày/tài liệu
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Gia hạn: 1 lần, thêm 10 ngày
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Giới hạn thiết bị: 2 thiết bị/tài liệu
                              </Typography>
                            </Box>
                          </Box>

                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              gutterBottom
                            >
                              Quyền truy cập
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, m: 0 }}>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Sinh viên lớp chất lượng, thành viên CLB Sách:
                                Tất cả bộ sưu tập
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Sinh viên đại trà: Trừ bộ sưu tập "Học liệu"
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Bạn đọc ngoài trường: Chỉ đọc thông tin mô tả
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion
                      expanded={expandedAccordion === "panel4"}
                      onChange={handleAccordionChange("panel4")}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary>
                        <Typography variant="subtitle1" fontWeight={600}>
                          IV. Quy định đặt phòng
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box component="ul" sx={{ pl: 3, m: 0 }}>
                          <Typography
                            component="li"
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Miễn phí cho Bạn đọc trong Trường tại địa điểm Nam
                            Định
                          </Typography>
                          <Typography
                            component="li"
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Đặt qua Cổng thông tin Thư viện
                          </Typography>
                          <Typography
                            component="li"
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Tối đa: 2 phòng/ngày ở 2 khung giờ khác nhau
                          </Typography>
                          <Typography
                            component="li"
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Thời gian: Tối thiểu 60 phút, tối đa 180 phút
                          </Typography>
                          <Typography
                            component="li"
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Số lượng: Tối thiểu 3 người/nhóm
                          </Typography>
                          <Typography
                            component="li"
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Trễ trên 15 phút sẽ bị hủy quyền check-in
                          </Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion
                      expanded={expandedAccordion === "panel5"}
                      onChange={handleAccordionChange("panel5")}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary>
                        <Typography variant="subtitle1" fontWeight={600}>
                          V. Xử lý vi phạm & Bồi thường
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              gutterBottom
                            >
                              Hình thức xử lý
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, m: 0 }}>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                <strong>Nhắc nhở:</strong> Vi phạm lần đầu (nói
                                chuyện ồn, ăn uống, sử dụng máy tính sai mục
                                đích)
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                <strong>Rời khỏi Thư viện 8 giờ:</strong> Vi
                                phạm sau khi đã bị nhắc nhở, không tuân thủ
                                hướng dẫn
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                <strong>Khóa thẻ 30 ngày:</strong> Mượn thẻ
                                người khác, xóa chương trình máy tính, mang tài
                                liệu ra ngoài không phép
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                <strong>Tước quyền sử dụng:</strong> Xé/cắt/lấy
                                cắp tài liệu, không trả tài liệu sau 30 ngày
                                khóa thẻ
                              </Typography>
                            </Box>
                          </Box>

                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              gutterBottom
                            >
                              Bồi thường vật chất
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, m: 0 }}>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Tài liệu đang phát hành: Bồi thường bằng tài
                                liệu mới tương đương + 10.000 VNĐ phí xử lý
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Tài liệu không phát hành: Gấp 3 lần giá bìa +
                                10.000 VNĐ phí xử lý
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Tài liệu không có giá: 1.000 VNĐ/trang (Tiếng
                                Việt), 10.000 VNĐ/trang (ngoại ngữ) + 10.000 VNĐ
                                phí xử lý
                              </Typography>
                              <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Thiết bị, tài sản: Bồi thường theo chi phí thực
                                tế
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </Container>
              </TabPanel>
            </Box>
          </Paper>
        </Container>

        <Footer />
      </Box>
    </>
  );
}
