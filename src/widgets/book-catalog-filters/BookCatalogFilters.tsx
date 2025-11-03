import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Divider,
  IconButton,
  Paper,
  Drawer,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  Skeleton,
} from "@mui/material";
import { Search, Close, ExpandMore, TuneOutlined } from "@mui/icons-material";
import type {
  Category,
  BookFilters,
  SortOption,
} from "../../features/books/types";
import {
  SORT_OPTIONS,
  FORMAT_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../../features/books/types";
import { useDebounce } from "../../shared/hooks/useDebounce";

interface BookCatalogFiltersProps {
  filters: BookFilters;
  sortBy: SortOption;
  onFiltersChange: (filters: BookFilters) => void;
  onSortChange: (sort: SortOption) => void;
  categories?: Category[];
  categoriesLoading?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function BookCatalogFilters({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  categories = [],
  categoriesLoading = false,
  mobileOpen = false,
  onMobileClose,
}: BookCatalogFiltersProps): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (!isMobile) {
      const handleScroll = () => {
        const activeEl = document.activeElement as HTMLElement | null;
        if (
          activeEl?.tagName === "INPUT" ||
          activeEl?.getAttribute("role") === "combobox"
        ) {
          activeEl.blur();
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile]);

  const [searchValue, setSearchValue] = useState(filters.keyword || "");
  const [lastFilterKeyword, setLastFilterKeyword] = useState(filters.keyword);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  if (lastFilterKeyword !== filters.keyword) {
    setLastFilterKeyword(filters.keyword);
    setSearchValue(filters.keyword || "");
  }

  useEffect(() => {
    if (filters.keyword && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [filters.keyword]);

  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    if (debouncedSearch !== filters.keyword) {
      onFiltersChange({ ...filters, keyword: debouncedSearch });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleFilterChange = (
    key: keyof BookFilters,
    value: string | number | null | undefined
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleResetFilters = React.useCallback(() => {
    setSearchValue("");
    onFiltersChange({
      keyword: "",
      category_id: null,
      status: undefined,
      format: null,
      language_code: null,
    });
  }, [onFiltersChange]);

  const hasActiveFilters = Boolean(
    filters.keyword ||
      filters.category_id ||
      filters.status ||
      filters.format ||
      filters.language_code
  );

  const FilterContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {isMobile && (
        <Box
          sx={{
            p: 2,
            pl: 1,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TuneOutlined color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Bộ lọc
            </Typography>
          </Box>
          <IconButton
            onClick={onMobileClose}
            size="small"
            aria-label="Đóng bộ lọc"
          >
            <Close />
          </IconButton>
        </Box>
      )}

      <Box sx={{ flex: 1, overflowX: "visible", p: { xs: 2, md: 0 } }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm sách..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            inputRef={searchInputRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchValue("");
                    }}
                    aria-label="Xóa tìm kiếm"
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ mb: 1.5, color: "text.primary" }}
          >
            Sắp xếp
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={sortBy}
              onChange={(e) => {
                onSortChange(e.target.value as SortOption);
                if (isMobile) setTimeout(() => onMobileClose?.(), 350);
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {categories.length > 0 && (
          <Accordion
            defaultExpanded
            elevation={0}
            disableGutters
            sx={{ "&:before": { display: "none" }, bgcolor: "transparent" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                px: 0,
                minHeight: 40,
                "&.Mui-expanded": { minHeight: 40 },
                "& .MuiAccordionSummary-content": {
                  my: 1,
                  "&.Mui-expanded": { my: 1 },
                },
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                Danh mục
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                px: 0,
                py: 1,
                overflow: "visible !important",
                position: "relative",
                "& .MuiFormControlLabel-root": {
                  overflow: "visible",
                  ml: -0.5,
                  pl: 0.5,
                  "& .MuiButtonBase-root": {
                    overflow: "visible",
                    position: "relative",
                    zIndex: 2,
                  },
                },
              }}
            >
              {categoriesLoading ? (
                <Box>
                  {[1, 2, 3, 4].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Skeleton variant="circular" width={20} height={20} />
                      <Skeleton variant="text" width="70%" height={20} />
                      <Skeleton
                        variant="rectangular"
                        width={30}
                        height={20}
                        sx={{ borderRadius: 2, ml: "auto" }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <RadioGroup
                  value={filters.category_id || "all"}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleFilterChange(
                      "category_id",
                      val === "all" ? null : val
                    );
                    if (isMobile) setTimeout(() => onMobileClose?.(), 350);
                  }}
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio size="small" />}
                    label={
                      <Typography variant="body2">Tất cả danh mục</Typography>
                    }
                  />
                  {categories.map((cat) => (
                    <FormControlLabel
                      key={cat.id}
                      value={cat.id}
                      control={<Radio size="small" />}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2">{cat.name}</Typography>
                          {cat.book_count !== undefined && (
                            <Chip
                              label={cat.book_count}
                              size="small"
                              sx={{ height: 20, fontSize: "0.7rem" }}
                            />
                          )}
                        </Box>
                      }
                      sx={{ width: "100%" }}
                    />
                  ))}
                </RadioGroup>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        <Divider sx={{ my: 2 }} />

        <Accordion
          defaultExpanded
          elevation={0}
          disableGutters
          sx={{ "&:before": { display: "none" }, bgcolor: "transparent" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              px: 0,
              minHeight: 40,
              "&.Mui-expanded": { minHeight: 40 },
              "& .MuiAccordionSummary-content": {
                my: 1,
                "&.Mui-expanded": { my: 1 },
              },
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              Định dạng
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              px: 0,
              py: 1,
              "& .MuiFormControlLabel-root": {
                ml: -0.5,
                pl: 0.5,
              },
            }}
          >
            <RadioGroup
              value={filters.format || "all"}
              onChange={(e) => {
                const val = e.target.value;
                handleFilterChange("format", val === "all" ? null : val);
                if (isMobile) setTimeout(() => onMobileClose?.(), 350);
              }}
            >
              <FormControlLabel
                value="all"
                control={<Radio size="small" />}
                label={<Typography variant="body2">Tất cả</Typography>}
              />
              {FORMAT_OPTIONS.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio size="small" />}
                  label={<Typography variant="body2">{opt.label}</Typography>}
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 2 }} />

        <Accordion
          elevation={0}
          disableGutters
          sx={{ "&:before": { display: "none" }, bgcolor: "transparent" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              px: 0,
              minHeight: 40,
              "&.Mui-expanded": { minHeight: 40 },
              "& .MuiAccordionSummary-content": {
                my: 1,
                "&.Mui-expanded": { my: 1 },
              },
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              Ngôn ngữ
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              px: 0,
              py: 1,
              "& .MuiFormControlLabel-root": {
                ml: -0.5,
                pl: 0.5,
              },
            }}
          >
            <RadioGroup
              value={filters.language_code || "all"}
              onChange={(e) => {
                const val = e.target.value;
                handleFilterChange("language_code", val === "all" ? null : val);
                if (isMobile) setTimeout(() => onMobileClose?.(), 350);
              }}
            >
              <FormControlLabel
                value="all"
                control={<Radio size="small" />}
                label={<Typography variant="body2">Tất cả</Typography>}
              />
              {LANGUAGE_OPTIONS.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio size="small" />}
                  label={<Typography variant="body2">{opt.label}</Typography>}
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>
      </Box>

      {hasActiveFilters && (
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            onClick={handleResetFilters}
            sx={{
              textAlign: "center",
              py: 1,
              px: 2,
              borderRadius: 1,
              cursor: "pointer",
              color: "primary.main",
              fontWeight: 600,
              fontSize: "0.875rem",
              transition: "all 0.2s",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Xóa tất cả bộ lọc
          </Box>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        disableScrollLock
        keepMounted={false}
        ModalProps={{
          disableEnforceFocus: true,
          disableAutoFocus: true,
          disableRestoreFocus: true,
          disableScrollLock: true,
          keepMounted: false,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            maxWidth: "80vw",
          },
        }}
        slotProps={{
          backdrop: { sx: { backdropFilter: "blur(4px)" } },
        }}
      >
        {FilterContent}
      </Drawer>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        position: "relative",
        overflow: "visible",
        "& .MuiAccordionDetails-root": {
          overflow: "visible !important",
          mx: -1,
          position: "relative",
          "& .MuiFormControlLabel-root": {
            overflow: "visible",
            ml: -0.5,
            "& .MuiButtonBase-root": {
              overflow: "visible",
              position: "relative",
              zIndex: 2,
            },
          },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <TuneOutlined
          color="primary"
          sx={{ fontSize: 24, WebkitFontSmoothing: "antialiased" }}
        />
        <Typography variant="h6" fontWeight={600}>
          Bộ lọc
        </Typography>
      </Box>
      {FilterContent}
    </Paper>
  );
}
