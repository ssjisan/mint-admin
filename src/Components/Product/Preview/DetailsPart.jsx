import { Box, Typography, Stack, Divider, Button } from "@mui/material";
import { useRef } from "react";
import PropTypes from "prop-types";
export default function DetailsPart({ descriptionHTML, specifications }) {
  const specRef = useRef(null);
  const descRef = useRef(null);

  const scrollToSpec = () => {
    specRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToDesc = () => {
    descRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Stack flexDirection="row" gap="12px" sx={{ mb: "40px" }}>
        <Button onClick={scrollToSpec} variant="contained">
          Specification
        </Button>
        <Button onClick={scrollToDesc} variant="outlined">
          Description
        </Button>
      </Stack>
      {/* ================= SPECIFICATION ================= */}
      <Box
        ref={specRef}
        sx={{
          p: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h6" sx={{ mb: 4 }}>
          Specification
        </Typography>
        {specifications?.map((group, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            {/* Group Title */}
            <Box
              sx={{
                padding: "12px",
                background: "#eeeafa",
                mb: 2,
                borderRadius: "12px",
              }}
            >
              <Typography
                variant="body"
                sx={{
                  color: "#792DF8",
                  fontWeight: 600,
                }}
              >
                {group.groupTitle}
              </Typography>
            </Box>

            {/* Items */}
            {group.items?.map((item, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }} // column below 600px (MUI sm breakpoint)
                  spacing={1}
                >
                  {/* LABEL */}
                  <Box
                    sx={{
                      minWidth: { sm: 200 }, // fixed width on desktop
                      maxWidth: { sm: 200 },
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#666",
                        fontWeight: 500,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>

                  {/* VALUE */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      fontWeight={500}
                      sx={{
                        textAlign: "left",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Stack>

                <Divider
                  sx={{
                    borderBottom: "1px solid #dfdfdf",
                    mt: 1,
                  }}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* 40px Gap */}
      <Box sx={{ height: 5 }} />

      {/* ================= DESCRIPTION ================= */}
      <Box
        ref={descRef}
        sx={{
          p: 3,
          backgroundColor: "#fff",
          mt: 4,
          scrollMarginTop: "100px",
        }}
      >
        <Typography variant="h6" sx={{ mb: 4 }}>
          Description
        </Typography>
        <Box dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
      </Box>
    </Box>
  );
}
DetailsPart.propTypes = {
  descriptionHTML: PropTypes.string,
  specifications: PropTypes.arrayOf(
    PropTypes.shape({
      groupTitle: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        }),
      ),
    }),
  ),
};
