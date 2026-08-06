import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaQrcode, FaSearch, FaUpload } from "react-icons/fa";
import jsQR from "jsqr";
import api from "../../services/api";
import VerifyResult from "./VerifyResult";
import "./VerifyPage.css";
import "./VerifyPortal.css";

function extractVerificationTarget(raw) {
  if (!raw) return { credentialId: "", source: "" };
  const trimmed = raw.trim();

  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    const verifyIndex = parts.indexOf("verify");
    const credentialId = verifyIndex !== -1 && parts[verifyIndex + 1]
      ? parts[verifyIndex + 1]
      : parts[parts.length - 1] || "";
    return { credentialId, source: url.searchParams.get("source") || "" };
  } catch {
    // Not a full URL (e.g. "localhost:3001/verify/xxx" or a bare id)
    const parts = trimmed.split("/").filter(Boolean);
    return { credentialId: parts[parts.length - 1] || trimmed, source: "" };
  }
}

async function decodeQrFromImage(file) {
  const imageBitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageBitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  return code?.data || null;
}

export default function VerifyPortal() {
  const [linkValue, setLinkValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [decoding, setDecoding] = useState(false);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const fileInputRef = useRef(null);

  const runVerification = async (rawInput) => {
    const { credentialId, source } = extractVerificationTarget(rawInput);

    if (!credentialId) {
      setHasSearched(true);
      setVerification(null);
      setError("Enter a valid verification link or QR code.");
      return;
    }

    setHasSearched(true);
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/verify/${credentialId}`, {
        params: source === "qr" ? { source } : undefined,
      });
      setVerification(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to verify this credential."
      );
      setVerification(requestError.response?.data || null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runVerification(linkValue);
  };

  const handleQrFile = async (file) => {
    if (!file) return;
    setDecoding(true);
    setError("");

    try {
      const decodedText = await decodeQrFromImage(file);
      if (!decodedText) {
        setHasSearched(true);
        setVerification(null);
        setError("No QR code could be found in that image.");
        return;
      }

      setLinkValue(decodedText);
      await runVerification(decodedText);
    } catch {
      setHasSearched(true);
      setVerification(null);
      setError("Could not read that image. Try another QR screenshot.");
    } finally {
      setDecoding(false);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    handleQrFile(file);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    handleQrFile(file);
  };

  const handlePaste = (event) => {
    const items = event.clipboardData?.items || [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        handleQrFile(item.getAsFile());
        return;
      }
    }
  };

  return (
    <main className="verify-page">
      <section className="verify-panel">
        <Link to="/" className="verify-brand">
          DiGiWallet
        </Link>

        <h1 className="verify-portal-title">Verify a credential</h1>
        <p className="verify-portal-subtitle">
          Paste a credential verification link, or upload / drag / paste a QR
          code screenshot, to check whether it's genuine.
        </p>

        <form className="verify-portal-form" onSubmit={handleSubmit}>
          <div className="verify-portal-input-row">
            <FaSearch aria-hidden="true" />
            <input
              type="text"
              value={linkValue}
              onChange={(event) => setLinkValue(event.target.value)}
              placeholder="Paste verification link, e.g. localhost:3001/verify/xxxxx"
            />
          </div>
          <button type="submit" disabled={loading || decoding}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="verify-portal-divider">
          <span>or</span>
        </div>

        <div
          className="verify-portal-dropzone"
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          onPaste={handlePaste}
          tabIndex={0}
          role="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <FaQrcode aria-hidden="true" />
          <p>
            <strong>Click to upload</strong>, drag a QR image here, or paste
            (Ctrl+V) a screenshot.
          </p>
          <span className="verify-portal-dropzone-hint">
            <FaUpload aria-hidden="true" /> PNG or JPG of the QR code
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            hidden
          />
        </div>

        {decoding && <p className="verify-portal-status">Reading QR code...</p>}

        {hasSearched && (
          <div className="verify-portal-result">
            <VerifyResult loading={loading} verification={verification} error={error} />
          </div>
        )}
      </section>
    </main>
  );
}
