const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { verifyCloudProof } = require("@worldcoin/idkit-core/backend");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const app_id = process.env.WLD_APP_ID;
const action = process.env.WLD_ACTION;

app.post("/api/verify", async (req, res) => {
  try {
    const { proof, signal } = req.body;

    const verifyRes = await verifyCloudProof(proof, app_id, action, signal);

    if (verifyRes.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({
        success: false,
        code: verifyRes.code,
        attribute: verifyRes.attribute,
        detail: verifyRes.detail,
      });
    }
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`World ID verifier API running at http://localhost:${port}`);
});
