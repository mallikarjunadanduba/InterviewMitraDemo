// PdfViewerWithMenu.jsx
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Button,
  Divider,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MenuIcon from "@mui/icons-material/Menu";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfViewerWithMenu() {
  const [view, setView] = useState("categories"); // "categories" or "pdf"
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [catAnchor, setCatAnchor] = useState(null);

  const pdfUrl = "/sample.pdf"; // place your PDF in public/

  const categories = [
    "7th Std - Others",
    "7th Std - Science",
    "8th Std - Mathematics",
    "8th Std - Science",
    "9th Std - Mathematics",
    "9th Std - Science",
    "Graduation - Business Analytics",
  ];

  const handleDocLoad = ({ numPages }) => setNumPages(numPages);

  return (
    <Box>
      {view === "categories" && (
        <Box p={2} style={{ background: "#f8f8f8", minHeight: "100vh" }}>
          {/* Top row */}
          <Box display="flex" alignItems="center" mb={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdfIcon />}
              style={{
                backgroundColor: "#4CAF50",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              PDF
            </Button>
            <Button
              endIcon={<ArrowDropDownIcon />}
              style={{ marginLeft: 16, textTransform: "none", fontWeight: "bold" }}
              onClick={(e) => setCatAnchor(e.currentTarget)}
            >
              Select Category
            </Button>
            <Menu
              anchorEl={catAnchor}
              open={Boolean(catAnchor)}
              onClose={() => setCatAnchor(null)}
              PaperProps={{ style: { minWidth: 260 } }}
            >
              {categories.map((cat) => (
                <MenuItem
                  key={cat}
                  onClick={() => {
                    setCatAnchor(null);
                    setView("pdf");
                  }}
                >
                  {cat}
                </MenuItem>
              ))}
              <Divider />
              <Box p={1}>
                <Typography variant="caption" style={{ fontWeight: "bold" }}>
                  Chapter: 1
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Introduction to Business Analytics
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => setView("pdf")}>Graduation - Engineering</MenuItem>
              <MenuItem onClick={() => setView("pdf")}>Graduation - Guidelines</MenuItem>
              <MenuItem onClick={() => setView("pdf")}>Graduation - Sales Force training</MenuItem>
              <MenuItem onClick={() => setView("pdf")}>Skill development - Engineering</MenuItem>
            </Menu>
          </Box>
        </Box>
      )}

      {view === "pdf" && (
        <Box>
          {/* PDF Toolbar */}
          <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
              <IconButton
                onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                disabled={pageNumber <= 1}
              >
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>
              <Typography variant="body1" style={{ margin: "0 8px" }}>
                ({pageNumber} / {numPages || "--"})
              </Typography>
              <IconButton
                onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
                disabled={pageNumber >= numPages}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>

              <Button
                variant="contained"
                startIcon={<PictureAsPdfIcon />}
                href={pdfUrl}
                download
                style={{
                  marginLeft: 16,
                  backgroundColor: "#4CAF50",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                PDF
              </Button>

              <IconButton
                style={{ marginLeft: "auto" }}
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
              >
                {["MCQ", "FAQ", "Lesson Plan", "Concept Map", "Vocabulary", "Full Video"].map(
                  (item) => (
                    <MenuItem key={item} onClick={() => setMenuAnchor(null)}>
                      {item}
                    </MenuItem>
                  )
                )}
              </Menu>
            </Toolbar>
          </AppBar>

          {/* PDF Viewer */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Document file={pdfUrl} onLoadSuccess={handleDocLoad}>
              <Page pageNumber={pageNumber} />
            </Document>
          </Box>
        </Box>
      )}
    </Box>
  );
}
