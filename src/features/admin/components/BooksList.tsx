import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Avatar,
  Chip,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { Edit, Trash2, Eye } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  category: string;
  thumbnail_url?: string;
  total_copies: number;
  available_copies: number;
}

interface BooksListProps {
  books: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (book: Book) => void;
  onDelete: (bookId: number) => void;
  onView: (book: Book) => void;
}

export default function BooksList({
  books,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onView,
}: BooksListProps): React.ReactElement {
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ảnh bìa</TableCell>
              <TableCell>Tên sách</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell>NXB</TableCell>
              <TableCell>Năm XB</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="center">Khả dụng</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography color="text.secondary">
                    Không có sách nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book.id} hover>
                  <TableCell>
                    <Avatar
                      src={book.thumbnail_url}
                      variant="rounded"
                      sx={{ width: 50, height: 75 }}
                    ></Avatar>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={book.title}>
                      <Typography
                        sx={{
                          maxWidth: 250,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {book.title}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.publisher}</TableCell>
                  <TableCell>{book.publication_year}</TableCell>
                  <TableCell>
                    <Chip label={book.category} size="small" />
                  </TableCell>
                  <TableCell align="center">{book.total_copies}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={book.available_copies}
                      size="small"
                      color={book.available_copies > 0 ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Xem chi tiết">
                      <IconButton size="small" onClick={() => onView(book)}>
                        <Eye size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton size="small" onClick={() => onEdit(book)}>
                        <Edit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          if (
                            window.confirm(`Xác nhận xóa sách "${book.title}"?`)
                          ) {
                            onDelete(book.id);
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.page}
        onPageChange={onPageChange}
        rowsPerPage={pagination.limit}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trong ${count}`
        }
      />
    </Box>
  );
}
