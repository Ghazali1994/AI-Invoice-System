// Import React hook for managing state
import { useState } from "react";

// Main App component
function App() {
  // State to store the selected invoice file
  const [file, setFile] = useState(null);

  // State to track loading/progress while AI extracts invoice data
  const [loading, setLoading] = useState(false);

  // State to store the extracted invoice data
  const [invoiceData, setInvoiceData] = useState({
    supplier: "",
    invoice_number: "",
    invoice_date: "",
    total_amount: "",
    items: []  // List of invoice items
  });

  // Function to send the uploaded invoice to backend for AI extraction
  const processInvoice = async () => {
    if (!file) {  // Check if file is selected
      alert("Please select invoice");
      return;
    }

    // Create FormData object to send file
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true); // Set loading state while request is in progress

      // Send POST request to FastAPI backend
      const response = await fetch("http://localhost:8000/extract", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      let result = data.result;

      // Clean up response if it comes as string with markdown-style JSON
      if (typeof result === "string") {
        result = result
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        result = JSON.parse(result); // Convert string to JSON
      }

      // Update state with extracted invoice data
      setInvoiceData(result);

    } catch (error) {
      console.error(error);
      alert("AI extraction failed");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to update top-level fields like supplier, invoice number, etc.
  const updateField = (field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to update fields of items (description, quantity, rate)
  const updateItemField = (index, field, value) => {
    const updatedItems = [...invoiceData.items]; // Copy items array
    updatedItems[index][field] = value; // Update specific field

    setInvoiceData({
      ...invoiceData,
      items: updatedItems
    });
  };

  // Function to submit invoice data to backend
  const submitInvoice = async () => {
    try {
      const response = await fetch("http://localhost:8000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(invoiceData) // Send extracted invoice data as JSON
      });

      const data = await response.json();

      alert(data.message || "Invoice submitted"); // Feedback
    } catch (error) {
      console.error(error);
      alert("Submit failed");
    }
  };

  // Function to "load" invoice into some software (similar to submit)
  const loadIntoSoftware = async () => {
    try {
      const response = await fetch("http://localhost:8000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(invoiceData)
      });

      const data = await response.json();

      alert(data.message || "Loaded successfully");
    } catch (error) {
      console.error(error);
      alert("Load failed");
    }
  };

  // Styles object to keep all inline styles in one place
  const styles = {
    page: {
      minHeight: "100vh",
      padding: 40,
      fontFamily: "Inter, sans-serif",
      // Layered background gradients
      background:
        "radial-gradient(circle at top left, #a78bfa, transparent 50%)," +
        "radial-gradient(circle at bottom right, #60a5fa, transparent 50%)," +
        "linear-gradient(135deg, #0f172a, #1e1b4b)"
    },
    container: { maxWidth: 1100, margin: "0 auto" },
    header: { textAlign: "center", marginBottom: 30 },
    title: {
      fontSize: 38,
      fontWeight: 700,
      background: "linear-gradient(90deg, #fff, #a5b4fc)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: 6
    },
    subtitle: { color: "#e5e7eb", opacity: 0.75 },
    card: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(18px)",
      borderRadius: 18,
      padding: 24,
      marginBottom: 18,
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
    },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
    label: { fontSize: 12, color: "#cbd5e1", marginBottom: 6, display: "block" },
    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid rgba(99, 102, 241, 0.15)",
      background: "rgba(255,255,255,0.7)",
      fontSize: 14,
      outline: "none",
      color: "#111827",
      boxSizing: "border-box"
    },
    uploadInput: {
      width: "100%",
      padding: 10,
      borderRadius: 12,
      border: "1px dashed rgba(255,255,255,0.3)",
      background: "rgba(255,255,255,0.05)",
      color: "white",
      boxSizing: "border-box"
    },
    button: (loading) => ({
      width: "100%",
      padding: 12,
      borderRadius: 12,
      border: "none",
      cursor: loading ? "not-allowed" : "pointer",
      fontWeight: 600,
      fontSize: 14,
      color: "white",
      marginTop: 14,
      background: loading
        ? "linear-gradient(135deg, #64748b, #475569)"
        : "linear-gradient(135deg, #6366f1, #8b5cf6)",
      boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
      transition: "0.3s"
    }),
    table: { width: "100%", borderCollapse: "collapse", marginTop: 20, color: "white" },
    th: { textAlign: "left", padding: 12, borderBottom: "1px solid rgba(255,255,255,0.2)" },
    td: { padding: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }
  };

  // Reusable Field component for input fields like supplier, invoice number, etc.
  const Field = ({ label, value, onChange }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={styles.label}>{label}</label>

      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
        onFocus={(e) => (e.target.style.border = "1px solid #6366f1")}
        onBlur={(e) => (e.target.style.border = "1px solid rgba(99, 102, 241, 0.15)")}
      />
    </div>
  );

  // JSX returned by the component
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.title}>AI Invoice Extraction</h1>
          <p style={styles.subtitle}>
            Upload invoices and extract structured data instantly
          </p>
        </div>

        {/* UPLOAD CARD */}
        <div style={styles.card}>
          <label style={styles.label}>Upload Invoice</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])} // Set selected file
            style={styles.uploadInput}
          />
          <button onClick={processInvoice} disabled={loading} style={styles.button(loading)}>
            {loading ? "Processing..." : "Process Invoice"}
          </button>
        </div>

        {/* OUTPUT CARD */}
        <div style={styles.card}>
          <h2 style={{ color: "white", marginBottom: 25 }}>Extracted Data</h2>

          {/* TWO-COLUMN GRID FOR MAIN FIELDS */}
          <div style={styles.grid}>
            <Field label="Supplier" value={invoiceData.supplier} onChange={(v) => updateField("supplier", v)} />
            <Field label="Invoice Number" value={invoiceData.invoice_number} onChange={(v) => updateField("invoice_number", v)} />
            <Field label="Invoice Date" value={invoiceData.invoice_date} onChange={(v) => updateField("invoice_date", v)} />
            <Field label="Total Amount" value={invoiceData.total_amount} onChange={(v) => updateField("total_amount", v)} />
          </div>

          {/* PRODUCTS TABLE */}
          <h2 style={{ color: "white", marginTop: 35, marginBottom: 15 }}>Products</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Rate</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items?.map((item, index) => (
                <tr key={index}>
                  <td style={styles.td}>
                    <input value={item.description || ""} onChange={(e) => updateItemField(index, "description", e.target.value)} style={styles.input} />
                  </td>
                  <td style={styles.td}>
                    <input value={item.quantity || ""} onChange={(e) => updateItemField(index, "quantity", e.target.value)} style={styles.input} />
                  </td>
                  <td style={styles.td}>
                    <input value={item.rate || ""} onChange={(e) => updateItemField(index, "rate", e.target.value)} style={styles.input} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: 20, marginTop: 35 }}>
            <button style={{ ...styles.button(false), flex: 1 }} onClick={submitInvoice}>
              Submit
            </button>
            <button style={{ ...styles.button(false), flex: 1, background: "linear-gradient(135deg, #059669, #10b981)" }} onClick={loadIntoSoftware}>
              Load Into Software
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Export App component
export default App;
